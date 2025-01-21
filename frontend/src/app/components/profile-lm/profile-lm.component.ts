import { NameInfo } from 'src/app/services/about.service';
import { Component, OnInit } from '@angular/core';
import { AboutService } from 'src/app/services/about.service';

@Component({
  selector: 'app-profile-lm',
  templateUrl: './profile-lm.component.html',
  styleUrls: ['./profile-lm.component.css']
})

export class ProfileLMComponent implements OnInit{
  public nameInfo?: NameInfo;

  constructor(private  aboutService : AboutService){}

  ngOnInit(): void {
    this.aboutService.getLuisaMuellerInfo().subscribe({
      next: (val) => {
        this.nameInfo = val;
      },

      error: (err) => {
        console.error(err);
        this.nameInfo = {
          firstName: 'error1',
          lastName: 'error1',
          optionalAttribute: 'Error!',
          optionalAttribute1: 'Error!',
          optionalAttribute2: 'Error!'
        };
      }
    });

  }

}
