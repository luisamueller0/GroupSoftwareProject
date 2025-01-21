import { Component, Input, OnInit } from '@angular/core';
import { CurrentEval } from 'src/app/models/currentEval';
import { Rating } from 'src/app/models/rating';
import { EvaluationService } from 'src/app/services/evaluation.service';


@Component({
  selector: 'app-single-rating',
  templateUrl: './single-rating.component.html',
  styleUrls: ['./single-rating.component.css']
})


export class SingleRatingComponent implements OnInit{

  @Input() rating?:Rating;

  public stars = '';
  public goldStar = '#A47D11';
  public stayAnonym = true;
  public currentHelpful ?: Boolean;
  public likes = 0;
  public dislikes = 0;

  constructor(private evaluationService : EvaluationService){}

  ngOnInit(): void {
    if(this.rating){
      this.evaluationService.getCurrentHelpful(this.rating.id).subscribe({
        next: (val : CurrentEval) => {
          if(val){
            if(val.helpful === true){
              this.currentHelpful = true;
            }
            else if(val.helpful === false){
              this.currentHelpful = false;
            }
          }
          else{
            this.currentHelpful = undefined;
          }},
        error: (err) => {
          this.currentHelpful = undefined;
          console.error('undefined' + err);
        }
      });
      for (let i = 0; i < 5; i++) {
        if (i < this.rating?.stars) {
          this.stars += '<span class="star">&#9733;</span>';
        } else {
          this.stars += '<span class="star">&#9734;</span>';
        }
      }

      this.stayAnonym  = this.rating.anonym;
      this.likes = this.rating.helpful;
      this.dislikes = this.rating.not_helpful;

    }
  }

  downVote(event: MouseEvent):void{

    if(this.rating){
        if(this.rating.own_evaluation){
          return;
        }
    }

    const target = event.target as HTMLElement;
    if (target.tagName === 'MAT-ICON') {
      if(this.rating !== undefined){
        if(this.currentHelpful === false){
          this.currentHelpful = undefined;
          this.rating.not_helpful -= 1;
          this.dislikes  = this.dislikes - 1;
          this.evaluationService.removeHelpful(this.rating.id);
        }
        else if(this.currentHelpful === true){
          this.currentHelpful = false;
          this.rating.helpful -= 1;
          this.likes = this.likes -1;
          this.rating.not_helpful += 1;
          this.dislikes = this.dislikes +1;
          this.rating.not_helpful = this.removeLeadingZero(this.rating.not_helpful);
          this.evaluationService.helpful(this.rating.id , false);
        }
        else {
          this.currentHelpful = false;
          this.rating.not_helpful += 1;
          this.dislikes = this.dislikes +1;
          this.rating.not_helpful = this.removeLeadingZero(this.rating.not_helpful);
          this.evaluationService.helpful(this.rating.id , false);
        }
      }

    }
  }

  upVote(event: MouseEvent):void{

    if(this.rating){
      if(this.rating.own_evaluation){
        return;
      }
    }

    const target = event.target as HTMLElement;
    if (target.tagName === 'MAT-ICON') {
       if(this.rating !== undefined){
        if(this.currentHelpful === false){
          this.currentHelpful = true;
          this.rating.not_helpful -= 1;
          this.dislikes = this.dislikes -1;
          this.rating.helpful += 1;
          this.likes = this.likes +1;
          this.rating.helpful = this.removeLeadingZero(this.rating.helpful);
          this.evaluationService.helpful(this.rating.id, true);
        }
        else if(this.currentHelpful === true){
          this.currentHelpful = undefined;
          this.rating.helpful -= 1;
          this.likes = this.likes -1;
          this.evaluationService.removeHelpful(this.rating.id);
        }
        else {
          this.currentHelpful = true;
          this.rating.helpful += 1;
          this.likes = this.likes + 1;

          this.rating.helpful = this.removeLeadingZero(this.rating.helpful);
          this.evaluationService.helpful(this.rating.id , true);
        }
       }
    }
  }

  removeLeadingZero(num: number): number {
    const numString = num.toString();

    if (numString.startsWith('0')) {
      return parseInt(numString.slice(1), 10);
    }

    return num;
  }

}
