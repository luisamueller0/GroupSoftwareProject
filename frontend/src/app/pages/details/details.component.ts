import { Component } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import * as Leaflet from 'leaflet';
import { Event } from 'src/app/models/events';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MapService } from 'src/app/services/map.service';
import { Rating } from 'src/app/models/rating';
import { EvaluationService } from 'src/app/services/evaluation.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit{

  constructor(private eventService: EventService, private mapService: MapService, private evaluationService : EvaluationService, private route: ActivatedRoute, private router : Router, private sanitizer: DomSanitizer){}

  public event ?: Event;
  public coords : Leaflet.LatLng = this.eventService.convertToLatLng([0, 0]);

  public options: Leaflet.MapOptions = {};
  public layers: Leaflet.Layer[] = [];

  public sameDate = false;
  public isOver = false;

  public hasChildPrice = false;
  public hasSeniorPrice = false;
  public hasStudentPrice = false;

  // Only for past events:
  public threeRatings:Rating[] = [];
  public allReviews: Rating[] = [];
  public showMehrAnzeigen = true;
  public showWenigerAnzeigen = false;

  public isBewertenVisible = false;

  public moreThanThree = false;
  public anyEvaluation = false;

  public canEvaluate = false;
  public hasEvaluated = false;

  public moreThan6 = false;
  public average = 0;
  public amount = 12;

  public starsFill = [0,0,0,0,0];
  //

  public src = '/img/preLoad/grünesBild.jpg';

  ngOnInit(): void {

    // Initialize map
    this.mapService.newMap();
    this.mapService.setOptions(18, this.coords);
    this.layers = this.mapService.getLayers();
    this.options = this.mapService.getOptions();

    this.eventService.getEventById(this.getIdFromUrl()).subscribe({ // search in database for event with id
      next: (event : Event) => {
        this.event = event;
        this.event.start_date = this.eventService.convertDate( this.event.start_date );
        this.event.title = this.eventService.cutoffAfterOpeningBracket( this.event.title );
        this.event.end_date = this.eventService.convertDate( this.event.end_date );
        this.event.price =  this.eventService.convertPriceFormat( this.event.price );
        this.event.price_child =  this.eventService.convertPriceFormat( this.event.price_child );
        this.event.price_senior =  this.eventService.convertPriceFormat( this.event.price_senior );
        this.event.price_student =  this.eventService.convertPriceFormat( this.event.price_student );

        this.event.description_html = this.sanitizer.bypassSecurityTrustHtml(this.event.description_html) as string;

        this.src = '/img/events/' + event.picture;

        // Price checks
        this.hasChildPrice = !(!this.event.price_child);
        this.hasSeniorPrice = !(!this.event.price_senior);
        this.hasStudentPrice = !(!this.event.price_student);

        this.sameDate = event.start_date === event.end_date;
        this.isOver = event.is_past;

        // Add Marker to map
        const lat = this.event.eventLocation.coordinates_lat;
        const lng = this.event.eventLocation.coordinates_lng;
        const coordString = [lat,lng].join(',');
        this.coords = this.eventService.convertToLatLng([lat,lng]);

        const eventOnMap = { [coordString] : [event] };

        this.mapService.setOptions(18, this.coords);
        this.options = this.mapService.getOptions();
        this.mapService.addEventMarkers(eventOnMap, () => {return;}, () => {return;});
        this.layers = this.mapService.getLayers();

        if(this.isOver){
          this.evaluationService.canEvaluate(Number(this.event.id)).subscribe({
            next: (val: boolean) => this.canEvaluate = val
          });

          this.evaluationService.hasntEvaluated(Number(this.event.id)).subscribe({
            next: (val: boolean) => this.hasEvaluated = !val
          });

          this.fetchEvaluations();

        }


      },
      error: (err) => {
        console.error('Error finding Event by ID: ' + err );
      }
    });
  }

  private fetchEvaluations() : void {
    this.evaluationService.getEvaluation(parseInt(this.getIdFromUrl())).subscribe({
      next: (val:Rating[]) => {
        this.allReviews = val;
        for (let index = 0; index < 3 && index < this.allReviews.length; index++) {
          this.threeRatings[index] = this.allReviews[index];
        }

        this.moreThanThree = this.allReviews.length > 3;
        this.anyEvaluation = this.allReviews.length !== 0;

        this.average = this.durchschnittlicheSterne(this.allReviews);
        this.amount =  this.allReviews.length;
        this.moreThan6 = this.amount >= 6;

        this.starsSetzen();
      },
      error: (err: Rating[]) => {
        this.allReviews = [{
          id: -1,
          firstname: 'error',
          lastname:'error',
          stars: 0,
          description: 'error',
          anonym: true,
          helpful: -1,
          not_helpful: -1,
          own_evaluation: false
        }];
        console.error(err);
      }
    });
  }

  public getIdFromUrl() : string {
    const id = this.route.snapshot.queryParamMap.get('id'); //url includes id from event
    if(id){
      return id;
    }
    return 'error';
  }

  /*
      -------------
      Functions concerned with current Events:
  */
  public bestellen(shoppingCart: boolean):void{

    if(this.event !== undefined){
      // event info
      localStorage.setItem('eventId', String(this.event.id));
      localStorage.setItem('eventName',this.event.title);
      localStorage.setItem('eventDate',this.event.start_date);
      localStorage.setItem('ticketAmount','1');

      // pricing info
      localStorage.setItem('price_normal',this.event.price);
      this.hasChildPrice ? localStorage.setItem('price_child',this.event.price_child) : localStorage.removeItem('price_child');
      this.hasSeniorPrice? localStorage.setItem('price_senior',this.event.price_senior) : localStorage.removeItem('price_senior');
      this.hasStudentPrice? localStorage.setItem('price_student',this.event.price_student) : localStorage.removeItem('price_student');

      // Single order or shopping cart
      localStorage.setItem('order', shoppingCart? 'warenkorbOrder' : 'singleOrder');

      this.router.navigateByUrl('/order');
    }

  }
  /*
      -------------

      Functions concerned with previous Events:
  */
  public starsSetzen(): void {

    for (let i = 0; i < 5; i++) {
      if (this.average >= (i + 1)) {
        this.starsFill[i] = 1;
      }
      else if (this.average >= (i + 0.5)) {
        this.starsFill[i] = 0.5;
      }

    }
  }

  public durchschnittlicheSterne(bewertungen: Rating[]): number {
    const anzahlBewertungen = bewertungen.length;
    let summeSterne = 0;

    for (const bewertung of bewertungen) {
      summeSterne += bewertung.stars;
    }

    let durchschnitt = summeSterne / anzahlBewertungen;
    durchschnitt = Number(durchschnitt.toFixed(1));
    return durchschnitt;
  }

  public openPopup(): void {
    this.isBewertenVisible = true;
  }

  public showMore(): void {

    for (let index = 0; index < this.allReviews.length; index++) {
      this.threeRatings[index] = this.allReviews[index];
    }

    this.showMehrAnzeigen = false;
    this.showWenigerAnzeigen = true;

  }

  public showLess(): void {
    this.threeRatings = this.threeRatings.slice(0, 3);
    this.showMehrAnzeigen = true;
    this.showWenigerAnzeigen = false;
  }




}
