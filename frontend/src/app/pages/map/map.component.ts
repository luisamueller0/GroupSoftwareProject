import { Component, OnInit,NgZone } from '@angular/core';
import { Event} from 'src/app/models/events';
import { EventService } from 'src/app/services/event.service';
import * as Leaflet from 'leaflet';
import { Router } from '@angular/router';
import { Attraction } from 'src/app/models/attraction';
import { AttractionService } from 'src/app/services/attraction.service';
import { PageStatusService } from 'src/app/services/page-status.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

export class MapComponent implements OnInit {

  public showPopup = false;

  public popupEvents: Event[] = []; //save the events at the same coordinates that should be listed in the popup
  public events: { [coordinates: string]: Event[]} = {}; // used to save events at the same coordinates
  public eventLocation = '';

  public type = 'Attraktionen'; //initially map shows the attractions
  public allEvents : Event[] = [];
  public event: Event = {
    id: -1,
    title: 'error',
    start_date: 'error',
    end_date: 'error',
    location: 'error',
    picture: 'error',
    price: 'error',
    is_past: false,
    price_child: 'error',
    price_senior: 'error',
    price_student: 'error',
    description: 'error',
    description_html: 'error',
    eventLocation: {coordinates_lat: 0,coordinates_lng: 0}
  }; //initial chosen event
  public allAttractions: Attraction[] = [];
  public attraction: Attraction = {
    id: '-1',
    name: 'error',
    coordinates_lat: 0,
    coordinates_lng: 0,
    picture: 'error',
    description: 'error',
    description_html: 'error'
  }; //initial chosen attraction


  constructor(private eventService: EventService,
    private pageStatus: PageStatusService,
    private attractionService: AttractionService,
    private mapService: MapService,
    private router: Router,
    private ngZone: NgZone){}


  layers: Leaflet.Layer[] = [];
  options : Leaflet.MapOptions = {};

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (events: Event[]) => {
        this.allEvents = events;

        // Loop through all events and count occurrences at each location
        for (const event of this.allEvents) {
          const coordinates = [event.eventLocation.coordinates_lat, event.eventLocation.coordinates_lng];

          // Convert coordinates to string representation
          const coordinatesString = coordinates.join(',');

          // Check if coordinates exist in the array
          if (coordinatesString in this.events) {
            this.events[coordinatesString].push(event);
          }
          else
          {
            this.events[coordinatesString] = [event];
          }
        }

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
          price_senior: 'error',
          price_child: 'error',
          price_student: 'error',
          description: 'error',
          description_html: 'error',
          is_past: false,
          eventLocation: {coordinates_lat: -1,coordinates_lng:  -1}
        }];
        console.error('Events not found:'+err);
      }
    });

    this.attractionService.getAttractions().subscribe({
      next: (attractions: Attraction[]) => {
        this.allAttractions = attractions;
        this.mapService.addAttractionMarkers(attractions, false, this.showAttraction.bind(this)); //by default attractions on map
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

    this.mapService.setOptions(16, new Leaflet.LatLng(47.70475111537479, 9.195249855100897));
    this.mapService.newMap();
    this.options = this.mapService.getOptions();
    this.layers = this.mapService.getLayers();

  }

  showEvent(e : Event): void {
    this.event = e;
    this.ngZone.run(() => {
      // Bearbeiten des Events für zugehörige Page
      this.event.title = this.eventService.cutoffAfterOpeningBracket(this.event.title);
      this.event.start_date = this.eventService.convertDate( this.event.start_date );
      this.event.end_date = this.eventService.convertDate( this.event.end_date );
      this.event.picture = '/img/events/' + this.event.picture;
      this.event.price = this.eventService.convertPriceFormat( this.event.price );

      // show details page of the clicked event
      this.router.navigateByUrl('/events/details?id=' + this.event.id);
    });
  }

   showAttraction(a : Attraction): void {
    this.attraction = a;
    this.ngZone.run(() => {
      // show details page of the clicked attraction
      this.router.navigateByUrl('/attraction?id=' + this.attraction.id);
    });
  }

  clickEventGroup(e : Event) : void {
    this.event = e;
    const c = e.eventLocation.coordinates_lat + ',' + e.eventLocation.coordinates_lng;
    this.openPopup(this.events[c]);
  }

  onTypeChange(event: globalThis.Event):void {
    const isChecked = (event.target as HTMLInputElement).checked; //true for events, otherwise false
    this.layers = []; // Clear existing markers
    this.mapService.newMap();
    if (isChecked) {
      this.mapService.addEventMarkers(this.events, this.showEvent.bind(this), this.clickEventGroup.bind(this));// Bindings are important as otherwise the mapService will not know what "this" is in the scope of the function
    } else {
      this.mapService.addAttractionMarkers(this.allAttractions, false, this.showAttraction.bind(this));
    }

    this.layers = this.mapService.getLayers();

  }

  openPopup(events: Event[]): void {
    // events are sorted by their date, earliest to latest
    events.sort((a, b) => {
      const dateA = new Date(a.start_date);
      const dateB = new Date(b.start_date);
      return dateA.getTime() - dateB.getTime();
    });
    this.popupEvents = events;
    this.showPopup = true;
    this.eventLocation = events[0].location;
    this.pageStatus.refreshView();
  }

  closePopup(): void {
    this.popupEvents= [];
    this.showPopup = false;
    this.eventLocation = '';
    this.pageStatus.refreshView();
  }



}
