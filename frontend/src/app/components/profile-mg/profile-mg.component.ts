import { NameInfo } from 'src/app/services/about.service';
import { Component, OnInit } from '@angular/core';
import { AboutService } from 'src/app/services/about.service';


@Component({
  selector: 'app-profile-mg',
  templateUrl: './profile-mg.component.html',
  styleUrls: ['./profile-mg.component.css']
})
export class ProfileMgComponent implements OnInit {
  public nameInfo? : NameInfo;


  constructor(private aboutService : AboutService){  }  //About service wird beim Konstruieren erzeugt, Konstruktor bleibt leer


  ngOnInit(): void {

    this.aboutService.getMaxGaletskiyInfo().subscribe({   //asynchroner Methodenaufruf, nachdem ein Objekt vom Typ NameInfo vom server gegetted wurde

      //Methode bei erfolgreichem Get
      next : (value) => {
        this.nameInfo = value;
      },

      //Methode bei Fehlern von Server/Route
      error : (err) => {
        console.error(err);
        this.nameInfo = {
          firstName : 'Error!',
          lastName : 'Error!',
          optionalAttribute: 'Error!',
          optionalAttribute1: 'Error!',
          optionalAttribute2: 'Error!'
        };
      }

    });

  }

}
