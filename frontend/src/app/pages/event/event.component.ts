import { Event } from 'src/app/models/events';
import { Component, NgZone, OnInit} from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import * as levenshtein from 'fast-levenshtein';

import 'leaflet.markercluster';
import * as Leaflet from 'leaflet';

import { AttractionService } from 'src/app/services/attraction.service';
import { Attraction } from 'src/app/models/attraction';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { MapService } from 'src/app/services/map.service';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})


export class EventComponent implements OnInit{
  public markerSelected = false;
  public attraction?: String;
  public searchEvent = '';
  public minPrice = Number.NEGATIVE_INFINITY;
  public maxPrice = Number.NEGATIVE_INFINITY;
  public date = '';
  public allEvents : Event[] = [];
  public pastEvents: Event[] = [];
  public events : Event[] = [];
  public eventsWithName : Event[] = [];
  public allAttractions: Attraction[] = [];
  public eventsWithMinPrice : Event[] = [];
  public lat ?: number;
  public lng ?: number;
  public lastMarker ?: Leaflet.Marker;
  public slideToggleValue = false;
  public max= 200;
  public min = 0;
  public showDropdown = false;
  public attractionClusterGroup ?: Leaflet.MarkerClusterGroup;
 //cluster for attractions
  public isOld = false;
  public filter = '';
  public activated = false;

  
  public options: Leaflet.MapOptions = {};
  public layers: Leaflet.Layer[] = [];



  constructor(private eventService: EventService,
    private attractionService: AttractionService,
    private mapService: MapService,
    private ngZone: NgZone,
    private router: Router){}

  ngOnInit() : void {
    this.eventService.getEvents().subscribe({
      next: (val:Event[]) => {
        this.allEvents = val;
        this.events = this.allEvents;
        this.eventsWithName = this.allEvents;
        this.eventsWithMinPrice = this.allEvents;

    if (this.allEvents.length > 0) {

      const prices: number[] = this.allEvents.map((event) => this.eventService.priceToNumber(event.price));

      // Find the minimum price using Math.min()
      this.min = Math.min(...prices) - 2;
      this.minPrice=this.min;

       // Find the maximum price using Math.max()
     this.max = Math.max(...prices) +5;
     this.maxPrice=this.max;


    } else {
      console.error('The events array is empty.');
    }

      },
      error: (err: Event[]) => {
        this.allEvents = [{
          id: -1,
          title: 'error',
          start_date: 'error',
          is_past: false,
          end_date: 'error',
          location: 'error',
          picture: 'error',
          price: 'error',
          price_child: 'error',
          price_senior: 'error',
          price_student: 'error',
          description: 'error',
          description_html: 'error',
          eventLocation: {coordinates_lat: 0,coordinates_lng: 0},
        }];
        console.error('Event not found:'+err);
      }
    });

    // Initialize Map: 
    this.mapService.newMap();
    this.mapService.setOptions(15, new Leaflet.LatLng(47.70475111537479, 9.195249855100897));
    this.layers = this.mapService.getLayers();
    this.options = this.mapService.getOptions();

    this.attractionService.getAttractions().subscribe({
      next: (attractions: Attraction[]) => {
        this.allAttractions = attractions;
        this.mapService.addAttractionMarkers(attractions, true, undefined, this.selectMarker.bind(this), this.isMarked.bind(this));
      },
      error: (err: Error) => {
        this.allAttractions = [{
          id: '-1',
          name: 'error',
          coordinates_lat: -1,
          coordinates_lng: -1,
          picture: 'error',
          description: 'error',
          description_html: 'error'
        }];
        console.error('Attractions not found: ' + err.message);
      }
    });

    this.eventService.getPastEvents().subscribe({
      next: (val:Event[]) => {
        this.pastEvents = val;
      },
      error: (err: Event[]) => {
        this.allEvents = [{
          id: -1,
          title: 'error',
          start_date: 'error',
          end_date: 'error',
          location: 'error',
          picture: 'error',
          price: 'error',
          price_child: 'error',
          price_senior: 'error',
          price_student: 'error',
          description: 'error',
          description_html: 'error',
          is_past: false,
          eventLocation: {coordinates_lat: 0,coordinates_lng: 0},
        }];
        console.error('Event not found:'+err);
      }
    });

  }
  public searchEvents() :  void {
    this.filter = ''; // Zurücksetzen des Filters

    // Überprüfe die Filterbedingungen und aktualisiere den Filter-Text
    if (this.markerSelected) {
      this.filter += 'Attraktion: ' + this.attraction + ', ';
    }
    if(this.maxPrice !== this.max && this.minPrice !== this.min){
      this.filter += 'Preis: ' + this.minPrice + '€ - ' + this.maxPrice + '€, ';
    }
    else{
      if (this.minPrice !== this.min) {
        this.filter += `Mindestpreis: ${this.minPrice}€, `;
      }
      if (this.maxPrice !== this.max) {
        this.filter += `Höchstpreis: ${this.maxPrice}€, `;
      }
    }
    if (this.date !== '') {
      this.filter += `Datum: ${this.eventService.convertDate( this.date )}, `;
    }
    if (this.slideToggleValue) {
      this.filter += 'Vergangene Events, ';
    }
    if (this.filter !== '') {
      this.filter = this.filter.slice(0, -2); // Entferne das letzte Komma und Leerzeichen
      this.activated = true;
    }
    else{
      this.activated = false;
    }

    if(this.slideToggleValue === false){
      this.eventsWithName = this.allEvents.filter(event =>
        this.minSubsetEditDistance(this.eventService.cutoffAfterOpeningBracket(event.title),this.searchEvent,this.editDistanceByWordLength()) &&
        this.checkMinPrice(this.eventService.priceToNumber(event.price)) &&
        this.checkMaxPrice(this.eventService.priceToNumber(event.price)) &&
        this.checkDate(event.start_date,event.end_date));
        this.fitsEventAndLocation();
        this.isOld = false;
      return;
    }else{
      this.eventsWithName = this.pastEvents.filter(event =>
      this.minSubsetEditDistance(this.eventService.cutoffAfterOpeningBracket(event.title),this.searchEvent,this.editDistanceByWordLength()) &&
      this.checkMinPrice(this.eventService.priceToNumber(event.price)) &&
      this.checkMaxPrice(this.eventService.priceToNumber(event.price)) &&
      this.checkDate(event.start_date,event.end_date));
      this.fitsEventAndLocation();
      this.isOld = true;
    return;
    }

  }
  public fitsEventAndLocation() : void {
    if(this.slideToggleValue === false){
      if(this.lat === undefined){
        this.events = this.allEvents.filter(event =>
          this.eventsWithName.includes(event));
        return;
      }
      else{
        this.events = this.allEvents.filter(event =>
          this.eventsWithName.includes(event) && event.eventLocation.coordinates_lat === this.lat && event.eventLocation.coordinates_lng === this.lng
        );
        return;
      }
    }
    if(this.lat === undefined){
      this.events = this.pastEvents.filter(event =>
        this.eventsWithName.includes(event));
      return;
    }
    else{
      this.events = this.pastEvents.filter(event =>
        this.eventsWithName.includes(event) && event.eventLocation.coordinates_lat === this.lat && event.eventLocation.coordinates_lng === this.lng
      );
      return;
    }
  }



  public onSlideToggleChange(event: MatSlideToggleChange):void{
    this.slideToggleValue = event.checked;
    this.searchEvents();
  }

  /**
   * @param word
   * @param search
   * @param distance
   * @returns true if a subset of the given word and the search have an edit distance <= input distance
   */
  public minSubsetEditDistance(word : string,search : string,distance : number) : boolean{
    const maxLength = search.length - distance;
    for(let i = 0; i < word.length  && maxLength < word.length; i++) {
      for(let j = i; j <= i + search.length; j++) {
        const subset = word.slice(i,j);
        const editDistance = levenshtein.get(subset,search,{ useCollator: true});
        if(editDistance <= distance) {
          return true;
        }
      }
    }
    return false;
  }
  public editDistanceByWordLength(): number{
    if(this.searchEvent.length === 0){
      return 1;
    }
    else if(this.searchEvent.length < 4){
      return 0;
    }
    else if(this.searchEvent.length < 6){
      return 1;
    }
    else{
      return 2;
    }
  }

  public checkMinPrice(price : number) : boolean {
    if(this.minPrice === Number.NEGATIVE_INFINITY){
      return true;
    }
    return price >= this.minPrice;
  }
  public checkMaxPrice(price : number) : boolean {
    if(this.maxPrice === Number.NEGATIVE_INFINITY){
      return true;
    }
    return price <= this.maxPrice;
  }
  public checkDate(startDate : string,endDate : string) : boolean { 
    if(this.date === ''){
      return true;
    }
    return this.date >= startDate && this.date <= endDate;
  }
  
  public isMarked(marker: Leaflet.Marker) : boolean{
    return marker === this.lastMarker;
  }

  public selectMarker(attraction: Attraction, marker: Leaflet.Marker, alreadyMarked: boolean) : void{
    if (!alreadyMarked) {
      if(this.lastMarker){
        this.mapService.toggleMarking(this.lastMarker, false);
      }
      
      this.mapService.toggleMarking(marker, true);

      this.lat = marker.getLatLng().lat;
      this.lng = marker.getLatLng().lng;
      this.lastMarker = marker;
      this.markerSelected = true;
      this.attraction = attraction.name;
    }
    else {
      if(this.lastMarker){
        this.mapService.toggleMarking(this.lastMarker, false);
      }

      this.lastMarker = undefined;
      this.lat = undefined;
      this.lng = undefined;
      this.markerSelected = false;
      this.attraction = '';

    }

    this.searchEvents();
    this.ngZone.run(() => this.fitsEventAndLocation());

  }
  

  public formatLabel(value: number | null) :string{

    return value + '€';
  }

  public dropdown(): void {
    if(this.showDropdown){
      this.showDropdown = false;
    }
    else{
      this.showDropdown = true;
    }
  }

  public reset():void{
    this.filter = '';
    this.lastMarker?.setIcon(Leaflet.icon({
      iconUrl: './assets/default-icon.png', //
      shadowUrl: './assets/icon-shadow.png',
      iconAnchor: [12.5, 41],
      shadowAnchor: [12.5,41],
    }));
    this.lastMarker = undefined;
    this.lat = undefined;
    this.lng = undefined;
    this.markerSelected = false;
    this.attraction = '';
    this.minPrice = this.min;
    this.maxPrice = this.max;
    this.slideToggleValue = false;
    this.date = '';
    this.isOld = false;
    this.searchEvents();



  }

}

