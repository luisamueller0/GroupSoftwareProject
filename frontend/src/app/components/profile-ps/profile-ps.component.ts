import { Component, OnInit } from '@angular/core';
import { AboutService} from 'src/app/services/about.service';
import { NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-profile-ps',
  templateUrl: './profile-ps.component.html',
  styleUrls: ['./profile-ps.component.css']
})
export class ProfilePsComponent implements OnInit {

  public nameInfo?: NameInfo;

  constructor(
    private aboutService: AboutService) {

  }

  ngOnInit(): void {

    this.aboutService.getPatrickStoerkInfo().subscribe({
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
