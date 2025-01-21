import { Injectable } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Attraction } from '../models/attraction';
import { Event } from '../models/events';

interface MapMarker {
  coordinates: number[];
  data: Event | Attraction;
  type: 'event' | 'attraction';
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  // default options 
  private options : Leaflet.MapOptions = {
    layers: [new Leaflet.TileLayer('http://konstrates.uni-konstanz.de:8080/tile/{z}/{x}/{y}.png'),],
    attributionControl: false
  };

  private layers : Leaflet.Layer[] = []; 


  public newMap() : void {
    this.layers = [];
  }

  public getLayers() : Leaflet.Layer[] {
    return this.layers;
  }

  public getOptions() : Leaflet.MapOptions {
    return this.options;
  }

  // setting option parameters. Center is an optional parameter, the default value corresponds to the center of the Insel Mainau  
  public setOptions(zoomLevel: number, center: Leaflet.LatLng = new Leaflet.LatLng(47.70475111537479, 9.195249855100897)) : void{
    this.options.zoom = zoomLevel;
    this.options.center = center;
  }

  private createCluster(background_color : string, box_shadow: string) : Leaflet.MarkerClusterGroup {

    const clusterStyle = (count: number): string => `<div class="custom-cluster-icon"
    style="color: white; font-size: 20px;
    font-weight: 700;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    font-height: 20px;
    background-color: ${background_color};
    text-align: center;
    box-shadow: 0 0 15px ${box_shadow};
    line-height: 25px;
  ">${count}</div>`;


    return Leaflet.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 40, // Adjust the cluster radius to control clustering strength
      disableClusteringAtZoom: 20,// Adjust the zoom level to disable clustering at lower levels
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount(); // Get the number of markers within the cluster
        return Leaflet.divIcon({
          html: clusterStyle(count),
          iconSize: [0, 0],
          iconAnchor: [12.5, 12.5]
        });
      }
    });


  }

  public convertToLatLng(coords: number[]): Leaflet.LatLngExpression {
    return Leaflet.latLng(coords[0], coords[1]);
  }

  // true = applies grey color to the marker, false = applies default color to the marker
  public toggleMarking(marker: Leaflet.Marker, mark: boolean): void {
    const color: string = mark ? './assets/grey-icon.png' : './assets/default-icon.png';
    marker.setIcon(Leaflet.icon({
      iconUrl: color,
      shadowUrl: './assets/icon-shadow.png',
      iconAnchor: [12.5, 41],
      shadowAnchor: [12.5, 41],
    }));
  }

  public addSingleEventMarker(marker: MapMarker, eventCluster : Leaflet.MarkerClusterGroup, clickSingle : (e: Event) => void, clickGrouped : (e: Event) => void) : void {
    const newMarker = Leaflet.marker(this.convertToLatLng(marker.coordinates));

    newMarker.setIcon(Leaflet.icon({
      iconUrl: './assets/icon.png', 
      shadowUrl: './assets/icon-shadow.png',
      iconAnchor: [12.5, 41],
      shadowAnchor: [12.5, 41],
    }));

    if (marker.count > 1) {
      newMarker.bindTooltip(() => marker.count.toString(), {
        permanent: true,
        direction: 'bottom',
        className: 'custom-tooltip'
      });

      const customTooltipStyles = `
        background-color:  #d02c44;
        color: white;
        font-size: 15px;
        font-weight: 600;
        padding: 5px 10px;
        border-radius: 10px;`;

      // Create a style element and append it to the head of the document
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `.custom-tooltip { ${customTooltipStyles} }`;
      document.head.appendChild(styleElement);


      //list of events in one marker should popup when marker is clicked
      newMarker.on('click', () => {
        const event = marker.data as Event;
        clickGrouped(event);
      });
    }
    else {
      newMarker.on('click', () => {
        const event = marker.data as Event;
        clickSingle(event);
      });
    }

    eventCluster.addLayer(newMarker);

  }

  public addEventMarkers(events: { [coordinates: string]: Event[]}, clickSingle : (e: Event) => void, clickGrouped : (e : Event) => void) : void { // the type of events is used to save events at the same coordinates    
    const eventClusterGroup = this.createCluster('#d02c44', '#9d2133'); 
  
    for (const coordinatesString in events){
      const event = events[coordinatesString][0]; //choose event that represents events at the specific coordinates
      const count = events[coordinatesString].length;
      const coords = [event.eventLocation.coordinates_lat, event.eventLocation.coordinates_lng];

      const marker: MapMarker = {
        coordinates: coords,
        data: event,
        type: 'event',
        count: count
      };

      this.addSingleEventMarker(marker, eventClusterGroup, clickSingle, clickGrouped);

    }

    this.layers.push(eventClusterGroup);  
  }

  public addSingleAttractionMarker(marker: MapMarker, attractionCluster : Leaflet.MarkerClusterGroup, clickSingle : (a: Attraction) => void) : void {
    const newMarker = Leaflet.marker(this.convertToLatLng(marker.coordinates));

    newMarker.on('click', () => {
      const attraction = marker.data as Attraction;
      clickSingle(attraction);

    });
    
    attractionCluster.addLayer(newMarker);
    
  }

  public addAttractionMarkers(attractions: Attraction[], markable: boolean, clickSingle? : (a: Attraction) => void, clickSingleMarked? : (a: Attraction, m: Leaflet.Marker, alreadyMarked: boolean) => void, isMarked?: (m: Leaflet.Marker) => boolean) : void {
    
    const attractionCluster = this.createCluster('#2596be', '#1c586d'); 

    for (const attraction of attractions) {
      const coords = [attraction.coordinates_lat, attraction.coordinates_lng];
      const marker: MapMarker = {
        coordinates: coords,
        data: attraction,
        type: 'attraction',
        count: 1 //only one attraction at one location
      };

      if(!markable && clickSingle){
        this.addSingleAttractionMarker(marker, attractionCluster, clickSingle);
      }
      else if(markable && clickSingleMarked && isMarked){
        this.addMarkableAttractionMarker(marker, attractionCluster, isMarked, clickSingleMarked);
      }
      else{
        console.error('Function addAttractionMarkers called with incorrect/undefined optional arguments!');
        return;
      }
      
    }
    this.layers.push(attractionCluster);
  
  }

  public addMarkableAttractionMarker(marker: MapMarker, attractionCluster : Leaflet.MarkerClusterGroup, isMarked: (m: Leaflet.Marker) => boolean, clickSingle : (a: Attraction, m: Leaflet.Marker, alreadyMarked: boolean) => void) : void {
    const newMarker = Leaflet.marker(this.convertToLatLng(marker.coordinates));

    newMarker.on('click', () => {
      const attraction = marker.data as Attraction;
      clickSingle(attraction, newMarker, isMarked(newMarker));

    });

    attractionCluster.addLayer(newMarker);

  }



}