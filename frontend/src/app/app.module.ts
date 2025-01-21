import { NgModule, inject} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RootComponent } from './pages/root/root.component';
import { AboutComponent } from './pages/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { MapComponent } from './pages/map/map.component';
import { TodoComponent } from './pages/todo/todo.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserInputComponent } from './components/user-input/user-input.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { ExampleComponent } from './components/example/example.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginService } from './services/login.service';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { ProfileJgComponent } from './components/profile-jg/profile-jg.component';
import { ProfileLMComponent } from './components/profile-lm/profile-lm.component';
import { ProfileMgComponent } from './components/profile-mg/profile-mg.component';
import { ProfilePsComponent } from './components/profile-ps/profile-ps.component';
import { ProfileTbComponent } from './components/profile-tb/profile-tb.component';
import { ProfileAsComponent } from './components/profile-as/profile-as.component';
import { Observable, map } from 'rxjs';
import { RegisterComponent } from './pages/register/register.component';
import { EditNameComponent } from './pages/edit-name/edit-name.component';
import { EditAdresseComponent } from './pages/edit-adresse/edit-adresse.component';
import { EditPasswordComponent } from './pages/edit-password/edit-password.component';
import { BezahlenComponent } from './pages/payment/payment.component';
import { PayBachelorcardComponent } from './pages/pay-bachelorcard/pay-bachelorcard.component';
import { PayHCIpalComponent } from './pages/pay-hcipal/pay-hcipal.component';
import { PaySWPsafeComponent } from './pages/pay-swpsafe/pay-swpsafe.component';
import { PaySuccessComponent } from './pages/pay-success/pay-success.component';
import { EventComponent } from './pages/event/event.component';
import { SingleEventComponent } from './components/single-event/single-event.component';
import { DetailsComponent } from './pages/details/details.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { AttractionComponent } from './pages/attraction/attraction.component';
import { SingleTicketComponent } from './components/single-ticket/single-ticket.component';
import { SingleRatingComponent } from './components/single-rating/single-rating.component';
import { OrderComponent } from './pages/order/order.component';
import { MatCardModule } from '@angular/material/card';
import { PaymentHeaderComponent } from './components/payment-header/payment-header.component';
import { MatSliderModule } from '@angular/material/slider';
import { DeleteProfileComponent } from './pages/delete-profile/delete-profile.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { SingleCartEventComponent } from './components/single-cart-event/single-cart-event.component';
import { BestellungenComponent } from './pages/bestellungen/bestellungen.component';
import { SingleOrderComponent } from './components/single-order/single-order.component';
import { SingleOrderTicketComponent } from './components/single-order-ticket/single-order-ticket.component';
import { RatingPopupComponent } from './components/rating-popup/rating-popup.component';
import { PopupComponent } from './components/popup/popup.component';

/**
 *  Hier definieren wir eine Funktion, die wir später (Zeile 43ff) dem Router übergeben.
 *  Damit fangen wir ab, falls ein Benutzer nicht eingeloggt ist,
 *      if (!inject(LoginService).isLoggedIn()) {
 *  leiten den Benutzer an die Startseite weiter
 *      inject(Router).navigate(['/login']);
 *  und sagen dem Angular Router, dass die Route geblockt ist
 *      return false;
 *
 *  (Siehe 'canActivate' Attribut bei den 'routes')
 *
 */
const loginGuard = (): Observable<boolean> => {
    const loginService = inject(LoginService);
    const router = inject(Router);

    /*
    if (loginService.authChecked) {
        return of(loginService.isLoggedIn());
    }
    */

    return loginService.checkAuth().pipe(map(isAuthenticated => {
        if (!isAuthenticated) {
            router.navigate(['/login']);
            return false;
        }
        return true;
    }));
};

//if user is logged in, he shall not be able to go to '/login' or '/register'
const restrictLoginGuard = (): Observable<boolean> => {

  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.checkAuth().pipe(map(isAuthenticated => {
      if (!isAuthenticated) {
          return true;
      }
      router.navigate(['/map']);
      return false;
  }));
};


/**
 *  Hier können die verschiedenen Routen definiert werden.
 *  Jeder Eintrag ist eine URL, die von Angular selbst kontrolliert wird.
 *  Dazu wird die angebene Komponente in das "<router-outlet>" der "root" Komponente geladen.
 *
 *  Dokumentation: https://angular.io/guide/router
 */
const routes: Routes = [
    // Jede Route, die wir festlegen wollen, braucht eine Komponente,
    // die beim Laden der Route instanziiert und angezeigt wird.
    // Die hier angegebenen Routen sind ein Beispiel; die "TodoComponent"
    // sollten über den Lauf des Projektes ausgetauscht werden
    { path: 'login', component: LoginComponent, canActivate: [restrictLoginGuard]},
    { path: 'register', component: RegisterComponent, canActivate: [restrictLoginGuard] },
    { path: 'about', component: AboutComponent },

    // Durch 'canActive' können wir festlegen, ob eine Route aktiviert werden kann - z.B. können wir
    // die Route sperren, falls der Benutzer nicht eingeloggt ist.

    { path: 'tickets', component: TicketsComponent, canActivate: [loginGuard]  },
    { path: 'shoppingCart', component: ShoppingCartComponent, canActivate: [loginGuard]  },

    { path: 'attraction', component: AttractionComponent },
    { path: 'map', component: MapComponent, canActivate: [loginGuard]},

    {
        path: 'events',
        canActivate: [loginGuard],
        children: [
            // Falls kein Pfad angegeben ist, wird diese Komponente automatisch geladen
            // (z.B. bei Aufruf von /profile/ )
            { path: 'details', component: DetailsComponent },

            { path: '', component: EventComponent },
            // Ansonsten werden die Pfade geschachtelt - folgende Komponente wird über den Pfad
            // "/profile/edit" geladen.

            // Alternativ können die Seiten (Komponenten) auch wiederverwendet werden auf mehreren Routen
            { path: 'about', component: AboutComponent },

        ]
    },



    // Routen können auch geschachtelt werden, indem der "Child" Eigenschaft der
    // Route nochmals ein paar Routen übergeben werden.
    // Falls Routen geschachtelt werden muss die "Hauptkomponente" der Schachtelung
    // auch eine <router-outlet> Komponente anbieten, in die "Unterkomponenten" hereingeladen
    // werden können (siehe auch RootComponent)
    {
        path: 'profile',
        canActivate: [loginGuard],
        children: [
            // Falls kein Pfad angegeben ist, wird diese Komponente automatisch geladen
            // (z.B. bei Aufruf von /profile/ )
            { path: 'edit-Name', component: EditNameComponent },

            { path: 'edit-Adresse', component: EditAdresseComponent },

            { path: 'edit-Password', component: EditPasswordComponent},

            { path: 'bestellungen', component: BestellungenComponent},
            { path: 'delete', component: DeleteProfileComponent},

            { path: '', component: ProfileComponent },
            // Ansonsten werden die Pfade geschachtelt - folgende Komponente wird über den Pfad
            // "/profile/edit" geladen.


            // Alternativ können die Seiten (Komponenten) auch wiederverwendet werden auf mehreren Routen
            { path: 'about', component: AboutComponent },

        ]
    },

    { path: 'order', component: OrderComponent},


    {
       path: 'payment',
      canActivate: [loginGuard],
      children: [
        {path: 'Bachelorcard', component: PayBachelorcardComponent},
        {path: 'HCIpal', component: PayHCIpalComponent},
        {path: 'SWPsafe', component: PaySWPsafeComponent},
        {path: 'success', component: PaySuccessComponent},
        {path: '', component: BezahlenComponent},
      ] 
    },

    // Je nach Konfiguration können wir auf eine andere Route weiterleiten
    // z.B. wollen wir bei Seitenaufruf (wenn keine 'route' festgelegt ist)
    // sofort auf die Login Route weiterleiten
    { path: '**', redirectTo: '/map' }
];


/**
 *  Hier werden Komponente für Angular "registriert".
 *  Damit Komponenten in HTML verwendet werden können, müssen eigene Komponenten in
 *  "Declarations" eingetragen werden (bei Verwendung von Addons kann das automatisch passieren)
 *  sowie third-party Bibliotheken (bspw. Angular-Material) in die "imports".
 */
@NgModule({
    declarations: [
        RootComponent,
        AboutComponent,
        NavigationBarComponent,
        LoadingSpinnerComponent,
        MapComponent,
        TodoComponent,
        ProfileComponent,
        UserInputComponent,
        ExampleComponent,
        LoginComponent,
        BackButtonComponent,
        ProfileJgComponent,
        ProfileLMComponent,
        ProfileMgComponent,
        ProfileTbComponent,
        ProfilePsComponent,
        ProfileAsComponent,
        RegisterComponent,
        EditNameComponent,
        EditAdresseComponent,
        EditPasswordComponent,
        BezahlenComponent,
        PayBachelorcardComponent,
        PayHCIpalComponent,
        PaySWPsafeComponent,
        PaySuccessComponent,
        EventComponent,
        SingleEventComponent,
        DetailsComponent,
        TicketsComponent,
        AttractionComponent,
        SingleTicketComponent,
        SingleRatingComponent,
        OrderComponent,
        PaymentHeaderComponent,
        ShoppingCartComponent,
        DeleteProfileComponent,
        SingleCartEventComponent,
        BestellungenComponent,
        SingleOrderComponent,
        SingleOrderTicketComponent,
        RatingPopupComponent,
        PopupComponent,
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        LeafletModule,
        MatButtonModule,
        MatIconModule,
        MatButtonToggleModule,
        MatIconModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatCardModule
    ],
    providers: [
        HttpClientModule
    ],
    bootstrap: [RootComponent]
})
export class AppModule { }
