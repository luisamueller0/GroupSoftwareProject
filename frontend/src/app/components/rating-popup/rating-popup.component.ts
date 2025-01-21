import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-rating-popup',
  templateUrl: './rating-popup.component.html',
  styleUrls: ['./rating-popup.component.css']
})
export class RatingPopupComponent implements OnInit {

    @Input() event_id = -1;
    @Input() title  = '';
    @Input() start_date = '';
    @Input() end_date = '';

    @Input() refresh = false;

    @Input() isBewertenVisible = false;

    @Output() isBewertenVisibleChange = new EventEmitter<boolean>();

    public reviewText = '';

    public dateText = '';

    public stayAnonym = false;
    public warning = false;
    public reviewSuccess = false;
    public characterCount = 0;
    public tooManySigns = false;

    public starCount = 0;
    public stars : string[] = ['\u2606', '\u2606', '\u2606', '\u2606', '\u2606'];

    public empty = '\u2606';
    public full = '\u2605';

    public dropDownOpen = false;
    public remaningCharacter = 300 - this.characterCount;
    public remainingText = 'Verbleibende Zeichen: ' + this.remaningCharacter;

    constructor(private evaluationService : EvaluationService, private eventService : EventService, private router: Router){}


    ngOnInit(): void {

      this.dateText = (this.start_date === this.end_date)?  this.start_date : (this.start_date + ' - ' + this.end_date);

      const remaning = document.getElementById('remaining');
      if(remaning !== null){
        remaning.textContent = 'Verbleibende Zeichen: 300';
     }

    }

    public onInputChange(): void {

      this.characterCount = this.reviewText.length;
      const remaningCharacter = 300 - this.characterCount;

      this.remainingText = 'Verbleibende Zeichen: ' + remaningCharacter;

      if(this.characterCount === 300){
        this.tooManySigns = true;
        setTimeout(()=>{
          this.tooManySigns = false;
        },1800);
      }
    }


    public clearAll() : void {
      this.reviewText = '';
      this.stars = ['\u2606', '\u2606', '\u2606', '\u2606', '\u2606'];
      this.warning = false;
      this.onInputChange();                                                // update remaining characters
      this.stayAnonym = false;

    }

    public abbrechen():void{
      this.clearAll();
      this.isBewertenVisibleChange.emit(false);
    }

    public absenden():void{

      if(this.stars[0] === this.full && this.event_id >= 0){

        this.evaluationService.createEvaluation(this.event_id,this.starCount,this.reviewText,this.stayAnonym).subscribe({
          error : (err) => {
            console.error(err);
         }
       });

          if(this.event_id >= 0){
            this.eventService.createEvaluation(this.event_id,this.starCount,this.reviewText,this.stayAnonym);
            this.reviewSuccess = true;

          setTimeout(()=>{
            this.reviewSuccess = false;

            if(this.refresh){
              // Refreshing the page
              const currentUrl = this.router.url;
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([currentUrl]);
              });

            }
          },3400);

          }

          this.isBewertenVisibleChange.emit(false);
          this.clearAll();

      }
      else{
        this.warning = true;
        setTimeout(()=>{
          this.warning = false;
        },3000);

      }
    }

    public changeFunction(i: number) : void {
      if(this.stars[i] === this.full){
          this.starsUpdate(i, true);
      }
      else{
        this.starsUpdate(i, false);
      }
    }



    public toggleCheckBox():void{
      this.stayAnonym = !this.stayAnonym;
    }

    public starsUpdate(i : number, reset: boolean) : void {

      if(!reset){
        for(let index = 0; index <= i; index++){
          this.stars[index] = this.full;
        }
      }
      else{
        for(let index = i + 1; index < 5; index ++){
          this.stars[index] = this.empty;
        }
      }

      this.starCount = i+1;

    }

    public emptyStars() : void {
      for(let i = 0; i < 5; i++){
        this.stars[i] = this.empty;
      }
    }



}
