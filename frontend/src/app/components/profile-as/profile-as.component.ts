import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-profile-as',
  templateUrl: './profile-as.component.html',
  styleUrls: ['./profile-as.component.css']
})
export class ProfileAsComponent implements OnInit{

   public myName?: NameInfo;

   constructor(
     private aboutService: AboutService) {
   }

   ngOnInit(): void {

     this.aboutService.getAdrianSopioInfo().subscribe({

       next: (val) => {
         this.myName = val;
       },

       // error: Es gab einen Fehler
       error: (err) => {
         console.error(err);
         this.myName = {
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
