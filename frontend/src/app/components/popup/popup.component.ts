import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Event } from 'src/app/models/events';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  @Input() popupType = '';
  @Output() closePopupClicked = new EventEmitter<void>();
  @Input() showPopup = false;

  // Used to handle x button
  onClosePopupClick(): void {
    this.closePopupClicked.emit();
  }

  //Used to list events
  @Input() popupEvents: Event[] = [];
  @Input() eventLocation = '';


  //Used for deletions
  @Output() deleteClicked = new EventEmitter<void>();

  onDeleteClick():void{
    this.deleteClicked.emit();
  }

  //Used for displaying which event the user will delete from the shopping cart
  @Input() deleteEvent? = '' ;


}
