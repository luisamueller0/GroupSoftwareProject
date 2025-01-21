import { Component, OnInit } from '@angular/core';
import { AboutService } from 'src/app/services/about.service';
import { NameInfo } from 'src/app/services/about.service';


@Component({
  selector: 'app-profile-tb',
  templateUrl: './profile-tb.component.html',
  styleUrls: ['./profile-tb.component.css']
})

export class ProfileTbComponent implements OnInit{
  public nameInfo?: NameInfo;

  constructor(private aboutService : AboutService){ }


  ngOnInit(): void {

    this.aboutService.getTimBleileInfo().subscribe({
      // next: Unser Wert kam erfolgreich an!
      next: (val) => {
        this.nameInfo = val;
      },

      // error: Es gab einen Fehler
      error: (err) => {
        console.error(err);
        this.nameInfo = {
          firstName: 'Error!',
          lastName: 'Error!',
          optionalAttribute: 'Error!',
          optionalAttribute1: 'Error!',
          optionalAttribute2: 'Error!'
        };
      }
    });
  }


}
