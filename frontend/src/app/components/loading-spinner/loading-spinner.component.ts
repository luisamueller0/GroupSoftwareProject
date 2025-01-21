import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {

  @Input()
  loading = true;

  @Input()
  big=false;

  @Input()
  invisible = false;    // used to get rid of the height and width
}
