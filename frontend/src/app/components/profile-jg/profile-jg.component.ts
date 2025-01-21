import { Component, OnInit } from '@angular/core';
import { AboutService } from 'src/app/services/about.service';
import { NameInfo } from 'src/app/services/about.service';


@Component({
  selector: 'app-profile-jg',
  templateUrl: './profile-jg.component.html',
  styleUrls: ['./profile-jg.component.css']
})
export class ProfileJgComponent implements OnInit {
  public nameInfo?: NameInfo;

  constructor(private aboutService : AboutService) {

  }

  ngOnInit(): void {
    this.aboutService.getJürgenGeiselhartInfo().subscribe({
      next: (val) => {
        this.nameInfo = val;
      },
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
