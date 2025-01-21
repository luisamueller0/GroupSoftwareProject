import { Component } from '@angular/core';
import { SampleService } from 'src/app/services/sample.service';


@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  constructor(
    public sampleService: SampleService) {
  }

}
