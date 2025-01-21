import {TicketManager} from './db-models/db-tickets';
import { UserManager } from './db-models/db-users';
import { Request, Response } from 'express';
import { User } from './models/user';
import { Event } from './models/event';
import jspdf = require('jspdf')
import fs = require('fs')
import qrc = require('qrcode')
import { EventManager } from './db-models/db-events';
import { Ticket, ticket_types} from './models/ticket';

export class TicketController{
    private dbticket = new TicketManager;
    private dbUser = new UserManager;
    private dbEvent = new EventManager;

    public async getTicket(request: Request, response: Response):Promise<void>{
        const user = await this.dbUser.getUserBySessionId(request.cookies.sessionId);
        if(!user){
            response.send('no User logged');
            response.status(400);
            return;
        }else{
            const uid: number = user.id;
            response.send(await this.dbticket.getTicketsbyUserId(uid));
            response.status(200);
        }  
    }

    public async getTicketsOfOrder(request: Request, response: Response) : Promise<void> {
        const order_id = request.body.order_id;
        const tickets = await this.dbticket.getTicketsByOrderId(order_id, request.cookies.sessionId);
        if(!tickets){
            response.send({code: 404, message: 'No tickets found for this order_id.'});
            response.status(404);
            return;
        }

        response.send(tickets);
        response.status(200);
        return;
    }
    
    public async createTickets(request: Request, response: Response) : Promise<void> {
        const user = await this.dbUser.getUserBySessionId(request.cookies.sessionId);
        if((!user) && (!request.body.eventId)){
            response.send({code: 400, message: 'error'});
            response.status(400);
            return;
        }else{
            const uid = user.id;
            const eventId = request.body.eventId;
            
            const types : number[] = request.body.typeAmounts;

            if(!((types.length-1) in ticket_types)){
                response.status(400);
                response.send({code: 400, message: 'Type-Amount Array has an incorrect format'});
            }

            for(let i = 0; i < types.length; i++){
                if(types[i] > 0){
                    for(let j = 0; j < types[i]; j++){
                        this.dbticket.createTicket(uid, eventId, i);
                    }
                }
            }

            response.send({code: 200, message: 'success'});
            response.status(200);
        
        }
    }

    public async getPastTickets(request: Request, response: Response):Promise<void>{
        const user = await this.dbUser.getUserBySessionId(request.cookies.sessionId);
        if(!user){
            response.send('no User logged');
            response.status(400);
            return;
        }
        else{
            const uid: number = user.id;
            response.send(await this.dbticket.getPastTicketsbyUserId(uid));
            response.status(200);
        }
    }
    

    public async ticketBought(request: Request, response: Response) : Promise<void> {
        const event_id = request.body.event_id;
        const user = await this.dbUser.getUserBySessionId(request.cookies.sessionId);

        if(!user){
            response.send({code: 400, message: 'User is not logged in'});
            response.status(400);
            return;
        }

        const tickets = await this.dbticket.getTicketsByUserAndEvent(user.id, event_id);

        if(!tickets){               // will only happen if something goes wrong in the db-call
            response.status(400);
            response.send({code: 400, message: 'Error happened while searching for tickets'});
            return;
        }
        
        if(tickets.length === 0){
            response.status(200);
            response.send(false);
            return;
        }

        response.status(200);
        response.send(true);

    }

    /*
        Prints multiple tickets in one file (calls the function to print a single ticket)
    */
    public async printTickets(request: Request, response: Response): Promise<void>{
        
        // Get User, Ticket and Events
        const user = await this.dbUser.getUserBySessionId(request.cookies.sessionId);
        if(!user){
            response.status(401);
            response.send({code: 401, message: 'Benutzer ist nicht eingeloggt.'});
            return;
        }

        const event = await this.dbEvent.getEventWithLocById(request.body.event_id);
        if(!event){
            response.status(404);
            response.send({code: 404, message: 'Das angegebene Event konnte nicht gefunden werden.'});
            return;
        }
        
        const tickets : Ticket[] = await this.dbticket.getTicketsByUserAndEvent(user.id, event.id);
                
        if(!tickets){
            response.status(404);
            response.send({code: 404, message: 'Das angegebene Ticket konnte für diesen User nicht gefunden werden.'});
            return;
        }

        // Create PDF
        const doc = new jspdf.jsPDF('l', 'mm', 'a5');

        // Create a page for every Ticket
        for(let i = 0; i < tickets.length; i++){
            await this.printTicket(doc, tickets[i], user, event);
            
            if(i !== tickets.length-1){             // this check is needed because otherwise an empty page would be appended
                doc.addPage();
            }
            
        }
        
        const filename = 'MainauExplorer_Tickets_' + user.id + '-' + event.id + '.pdf';
        doc.save(filename);

        await this.placePDFFile(filename, (err: Error) => {
            if (err) {
                console.error(err);
                response.status(500); // Server error
                response.send({code: 500, message: 'Es gab einen Fehler dabei, die PDF Datei zu genererien. Wenden Sie sich mit folgender Fehlermeldung an einen Administrator: ' + err});
                return;
            }else{
                response.status(200);
                response.send({message: 'PDF generated.', filename: filename});        
            }
            });

    }

    private async printTicket(doc : jspdf.jsPDF, ticket : Ticket, user : User, event: Event) : Promise<void>{

         /*
                Format Conversion
         */
         
         // Title
         let convTitle = event.title;
         if(event.title.indexOf('(') !== -1){
            convTitle = event.title.slice(0, event.title.indexOf('('));
        }

        // Type/Price
        let convPrice : string;
        let convType : string; 
        switch(ticket.type){
            case ticket_types.normal: 
                convPrice = event.price;
                break;
            case ticket_types.child:
                convPrice = event.price_child;
                convType = 'Kinderticket (6-12 Jahre)';
                break;
            case ticket_types.senior:
                convPrice = event.price_senior;
                convType = 'Seniorenticket';
                break;
            case ticket_types.student:
                convPrice = event.price_student;
                convType = 'Schüler & Studierendenticket';
                break;
        }

        convPrice = convPrice.slice(1, event.price.length) + '€';               
        convPrice = convPrice.replace('.', ',');

        // Date
        const dateConvert = (s: string): string => {
            const split = s.split('-');
            return split[2] + '.' + split[1] + '.' + split[0];
        };
        
        const convStart_date = dateConvert(event.start_date);
        const convEnd_date = dateConvert(event.end_date);
        
        // HTML Masking
        convTitle = convTitle.replace(/&quot;/g, '"');
        convTitle = convTitle.replace(/&amp;/g, '&');

        // Helper function for quick switching between font types
        const fontSwitch = (doc: jspdf.jsPDF, t: number): void => {
            switch (t) {
                case 0:
                    doc.setFont('times', 'normal');
                    return;
                case 1:
                    doc.setFont('times', 'bold');
                    return;
                case 2:
                    doc.setFont('times', 'italic');
                    return;
            }
        };

        // Images  
        const background = fs.readFileSync('./img/ticket_pdf/background.png', 'base64');
        doc.addImage(background, 'png', -0.5, 0, 210, 148);

        const logo = fs.readFileSync('./img/ticket_pdf/mainau_logo_t.png', 'base64');
        doc.addImage(logo, 'png', 150, 2, 50, 50);

        // QR Code
        const qrCode = await this.generateQRCode(ticket.id);
        doc.addImage(qrCode, 'png', 120, 60, 60, 60);
        doc.setLineWidth(2);
        doc.rect(120, 60, 60, 60);

        // Ticket Border
        doc.setLineWidth(1);
        doc.rect(3, 3, 204, 142);

        // Event title / info 
        let lastLine = 0;
        doc.setFontSize(28);
        doc.setFont('Times', 'Italic');
        
        // Check for a title that's to long
        const title: string[] = doc.splitTextToSize(convTitle, 135);
        lastLine = 30 + 10 * title.length;
        doc.text(title, 15, 40);
        doc.setFontSize(16);
        fontSwitch(doc, 0);
       
        // Company/Insel Mainau Info
        doc.text('Insel Mainau', 16, 30);
        fontSwitch(doc, 1);
        
        // Event Date
        if (convStart_date === convEnd_date) {
            doc.text('Am:', 15, lastLine += 10);
            fontSwitch(doc, 0);
            doc.text(convStart_date, 35, lastLine);
        }
        else {
            doc.text('Von:', 15, lastLine += 10);
            doc.text('Bis:', 15, lastLine + 8);
            fontSwitch(doc, 0);
            doc.text(convStart_date, 35, lastLine);
            doc.text(convEnd_date, 35, lastLine += 8);
        }
        fontSwitch(doc, 1);
        
        // Ticket Price
        doc.text('Preis:', 15, lastLine + 8);
        fontSwitch(doc, 0);
        doc.text(convPrice, 35, lastLine += 8);

        // Type
        if(convType){
            fontSwitch(doc,2);
            doc.text(convType, 15, lastLine + 8);
        }

        // User info
        fontSwitch(doc, 1);
        doc.text('Ticket für:', 15, 105);
        fontSwitch(doc, 0);
        doc.text('Vorname:', 15, 115);
        doc.text('Nachname:', 15, 122);
        doc.text(user.firstname, 45, 115);
        doc.text(user.lastname, 45, 122);

        // QR Code message 
        doc.setFontSize(10);
        fontSwitch(doc,2);
        doc.text('Lassen Sie diesen QR-Code', 150, 125, { align: 'center' });
        doc.text('bitte beim Eintritt scannen!', 150, 130, { align: 'center' });

    }

    public async deleteTicketPDF(request: Request, response: Response) : Promise<void>{
        const filename = request.body.filename;
        fs.rm('./public/' + filename, 
                     (err: Error) => {
                        if(err){
                            response.status(500);
                            response.send({code: 500, message: 'Problem during deletion of PDF File:' + err});
                        }else{
                            response.status(200);
                            response.send({code: 200, message: 'Deleted PDF from server'});
                        }
                     });
    }

    public async generateQRCode(ticketId : number) : Promise<string> {
        
        const qrPromise = new Promise<string>(
            (resolve) => {
                let codeURL : string;
                qrc.toDataURL('{"ticket_id": ' + + ticketId + '}', (err, url) => {
                    if(err){
                       console.error(err);
                       codeURL = '';
                       return;
                    }
                    codeURL = url;
                    resolve(codeURL);
                });
            }
        );
       return qrPromise;
    }

    public async placePDFFile(filename: string, callback : (err: Error) => void) : Promise<void>{

        await fs.rename('./' + filename, './public/' + filename, callback);
    }
}