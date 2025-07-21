/**
 *  In dieser Datei konfigurieren wir einen Express Webserver, der es uns ermöglicht,
 *  verschiedene Routen anzugeben und zu programmieren.
 *  Hier verzichten wir auf die Klassendefinition, da diese nicht nötig ist.
 *
 *  Weiterführende Links:
 *  https://expressjs.com/en/starter/basic-routing.html
 */

import errorHandler from 'errorhandler';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { ApiController } from './api';
import { AuthController } from './auth';
import { EventController } from './events';
import { TicketController } from './my-ticket';
import { AttractionController } from './attractions';
import { evaluationController } from './evaluations';
import { HCIPalSercive } from './payment-services/hciPal';
import { DeleteUserManager } from './delete-profile';
import { ShoppingCartController } from './shoppingCart';
import { OrderRetriever } from './order-retriever';
import { BCService } from './payment-services/bachelorCard';
import { SWPSafeService } from './payment-services/swpSafe';

// Express server instanziieren
const app = express();

// Express Konfiguration
app.set('port', 3000);

// "JSON" Daten verarbeiten falls der Request zusätzliche Daten im Request hat
app.use(express.json());
// "UrlEncoded" Daten verarbeiten falls in der Request URL zusätzliche Daten stehen (normalerweise nicht nötig für Angular)
app.use(express.urlencoded({ extended: true }));
// Wir erlauben alle "Cross-Origin Requests". Normalerweise ist man hier etwas strikter, aber für den Softwareprojekt Kurs
// erlauben wir alles um eventuelle Fehler zu vermeiden.
app.use(cors({ origin: '*' }));

// Cookies lesen und erstellen
app.use(cookieParser());

/**
 *  API Routen festlegen
 *  Hier legen wir in dem "Express" Server neue Routen fest. Wir übergeben die Methoden
 *  unseres "ApiControllers", die dann aufgerufen werden sobald jemand die URL aufruft.
 *  Beispiel
 *  app.get('/api', api.getInfo);
 *       ↑     ↑          ↑
 *       |     |     Diese Methode wird aufgerufen, sobald ein Nutzer die angebene
 *       |     |     URL über einen HTTP GET Request aufruft.
 *       |     |
 *       |   Hier definieren sie die "Route", d.h. diese Route
 *       |   ist unter "http://localhost/api" verfügbar
 *       |
 *   Für diese Route erwarten wir einen GET Request.
 *   Auf derselben Route können wir auch einen POST
 *   Request angeben, für den dann eine andere Methode
 *   aufgerufen wird.
 *
 *  Weiterführende Links:
 *  - Übersicht über verschiedene HTTP Request methoden (GET / POST / PUT / DELETE) https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 *  - REST Architektur: https://de.wikipedia.org/wiki/Representational_State_Transfer
 *
 *  Bitte schaut euch das Tutorial zur Backend-Entwicklung an für mehr Infos bzgl. REST
 */
const auth = new AuthController();
const api = new ApiController();
const hciPal = new HCIPalSercive();
const swpSafe = new SWPSafeService();
const bachelorcard = new BCService();
const event = new EventController();
const ticket = new TicketController();
const order = new OrderRetriever();
const attraction = new AttractionController();
const evaluation = new evaluationController();
const deleteUser = new DeleteUserManager();
const shoppingCart = new ShoppingCartController();

app.all('/api/*', auth.authorize.bind(auth));

app.get('/api', api.getInfo);
//about us
app.get('/api/name', api.getNameInfo);
app.get('/api/juergen-geiselhart', api.getJuergenGeiselhartInfo);
app.get('/api/max-galetskiy', api.getMaxGaletskiyInfo);
app.get('/api/tim-bleile', api.getTimBleileInfo);
app.post('/api/name/:id', api.postNameInfo);
app.get('/api/luisa-mueller', api.getLuisaMuellerInfo);
app.get('/api/patrick-stoerk', api.getPatrickStoerkInfo);
app.get('/api/adrian-sopio', api.getAdrianSopioInfo);

//login-logout-register
app.get('/api/auth',auth.getAuth.bind(auth));
app.post('/api/login', auth.login.bind(auth));
app.delete('/api/logout', auth.logout.bind(auth));
app.post('/api/register', auth.register.bind(auth));

//personal info
app.get('/api/user-info', auth.getUserInfo.bind(auth));
app.put('/api/change-user',auth.setUserInfo.bind(auth));
app.post('/api/validate-pw',auth.validatePassword.bind(auth));

//app.delete('/api/delete-profile');
app.delete('/api/delete-profile',deleteUser.deleteProfile.bind(deleteUser));

//payment
app.post('/api/payment/hcipal/pay', hciPal.payment.bind(hciPal));
app.post('/api/payment/hcipal/payback', hciPal.refundPayment.bind(hciPal));

app.post('/api/payment/bachelorcard/pay', bachelorcard.payment.bind(bachelorcard));
app.post('/api/payment/bachelorcard/payback', bachelorcard.refundPayment.bind(bachelorcard));

app.post('/api/payment/swpsafe/pay', swpSafe.payment.bind(swpSafe));
app.post('/api/payment/swpsafe/payback', swpSafe.refundPayment.bind(swpSafe));

//events
app.get('/api/events',event.getEvents.bind(event));
app.get('/api/single-event',event.getEvent.bind(event));
app.get('/api/past-events',event.getPastEvents.bind(event));

//tickets
app.get('/api/tickets',ticket.getTicket.bind(ticket));
app.get('/api/past-tickets',ticket.getPastTickets.bind(ticket));
app.post('/api/create-ticket',ticket.createTickets.bind(ticket));
app.post('/api/ticket-bought', ticket.ticketBought.bind(ticket));
app.post('/api/print-ticket', ticket.printTickets.bind(ticket));
app.delete('/api/delete-ticketfile', ticket.deleteTicketPDF.bind(ticket));

//orders 
app.post('/api/order-tickets', ticket.getTicketsOfOrder.bind(ticket));
app.get('/api/orders', order.getOrders.bind(order));
app.get('/api/includes-past',order.checkIncludePastTickets.bind(order));

//attractions
app.get('/api/attraction', attraction.getAttractions.bind(attraction));
app.get('/api/single-attraction', attraction.getAttractionById.bind(attraction));

//bewerten
app.post('/api/evaluate', evaluation.addEvaluation.bind(evaluation));
app.get('/api/evaluation', evaluation.getEvaluation.bind(evaluation));
app.get('/api/evaluations', evaluation.getEvaluations.bind(evaluation));
app.get('/api/evaluation-helpful',evaluation.getEvaluationHelpful.bind(evaluation));
app.post('/api/helpful-evaluate', evaluation.helpful.bind(evaluation));//der call ist sowohl zum erzeugen wie auch zum verändern
app.delete('/api/helpful-delete', evaluation.deleteHelpful.bind(evaluation));
app.post('/api/check-evaluation', evaluation.checkEvaluation.bind(evaluation));

//shopping cart 
app.post('/api/add-item', shoppingCart.addItem.bind(shoppingCart));
app.get('/api/cart', shoppingCart.getCart.bind(shoppingCart));
app.delete('/api/delete-cart', shoppingCart.deleteCart.bind(shoppingCart));
app.post('/api/buy-cart', shoppingCart.buyCart.bind(shoppingCart));
app.delete('/api/delete-item', shoppingCart.deleteItem.bind(shoppingCart));


// Falls ein Fehler auftritt, gib den Stack trace aus
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

/**
 *  Dateien aus dem "public" und "img" Ordner werden direkt herausgegeben.
 *  D.h. falls eine Datei "myFile.txt" in dem "public" Ordner liegt, schickt der Server
 *  diese Datei wenn die "http://localhost/myFile.txt" URL aufgerufen wird.
 *  Dateien, die im 'img' Ordner liegen, können über den Pfad 'http://localhost/img/'
 *  abgerufen werden.
 *
 *  Das 'frontend/' Projekt wurde so konfiguriert, dass der 'build' Befehl (bzw. 'npm run build')
 *  im Frontend Projekt die 'transpilierten' Dateien in den 'public' Ordner des backend Projekt legen.
 *  Das kann nützlich sein, falls das ganze Projekt via Docker laufbar sein soll
 *  (erst nach Aushandeln für Bonuspunkte via User Story!)
 */
app.use('/', express.static('public'));
app.use('/img', express.static('img'));

/**
 *  Hier wird die "default Route" angegeben, d.h. falls der Server nicht weiß wie er auf "/random-request" antworten soll
 *  wird diese Methode aufgerufen. Das Frontend Angular hat selbst ein eigenes Routing, weswegen wir immer die "index" Seite
 *  von Angular schicken müssen. Falls eine der zuvor angegebenen Routen passt, wird diese Methode nicht aufgerufen.
 *  Diese Route funktioniert erst, sobald der 'build' Schritt im Frontend ausgeführt wurde und ist nur von Relevanz, falls
 *  das Projekt via Docker laufbar sein soll (siehe oben).
 */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Wir machen den konfigurierten Express Server für andere Dateien verfügbar, die diese z.B. Testen oder Starten können.
export default app;

