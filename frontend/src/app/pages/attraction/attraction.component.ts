import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Leaflet from 'leaflet';
import { Attraction } from 'src/app/models/attraction';
import { AttractionService } from 'src/app/services/attraction.service';
import { MapService } from 'src/app/services/map.service';


@Component({
  selector: 'app-attraction',
  templateUrl: './attraction.component.html',
  styleUrls: ['./attraction.component.css']
})
export class AttractionComponent implements OnInit{

  constructor(private attractionService: AttractionService, private mapService: MapService, private route: ActivatedRoute){}

  public attraction ?: Attraction;
  public coords = Leaflet.latLng(0,0);
  public marker = Leaflet.marker(this.coords);
  public src = '/img/preLoad/grünesBild.jpg';

  public layers : Leaflet.Layer[] = [];
  public options : Leaflet.MapOptions = {};

  ngOnInit(): void {

    // Initialize Map
    this.mapService.newMap();
    this.mapService.setOptions(18, this.coords);
    this.layers = this.mapService.getLayers();
    this.options = this.mapService.getOptions();

    this.attractionService.getAttractionById(this.getIdFromUrl()).subscribe({
      next : (attraction : Attraction) => {
        this.attraction = attraction;

        const lat = this.attraction.coordinates_lat;
        const lng = this.attraction.coordinates_lng;
        this.coords = Leaflet.latLng([lat,lng]);

        this.src = '/img/locations/' + this.attraction.picture;

        this.mapService.setOptions(18, this.coords);
        this.options = this.mapService.getOptions();
        this.mapService.addAttractionMarkers([attraction], false, () => {return;});

      },
      error: (err) => {
        console.error('Error finding Attraction by ID:' + err);
      }
    });
  }




  public getIdFromUrl(): string {
    const id = this.route.snapshot.queryParamMap.get('id');
    if(id){
      return id;
    }
    console.error('Error getting ID from URL.');
    return 'error';
  }

}
