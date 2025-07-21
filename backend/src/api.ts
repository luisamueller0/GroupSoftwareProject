/**
 *  In dieser Datei schreiben wir einen Controller, der Webrequests von
 *  dem in "app.ts" definierten Webserver beantwortet. Die Methoden werden
 *  in "app.ts" mit einer entsprechenden Webroute verknüpft.
 *  Jede Methode, die mit einer Webroute verknüpft wird, muss einen
 *  "Request" (was angefragt wird) und eine "response" (was unser Server antwortet)
 *  entgegennehmen.
 *  *Wichtig ist, dass jede Response zeitgemäß abgeschlossen wird*, z.B. via
 *  response.send(...data...)
 *  oder response.end()
 */
import { Request, Response } from 'express';

export class ApiController {

  public getInfo(request: Request, response: Response): void {
    response.status(200);
    response.send('ok');
  }

  public getNameInfo(request: Request, response: Response): void {
    response.status(200);
    response.send({
      firstName: 'Max',
      lastName: 'Mustermann'
    });
  }

  public getJuergenGeiselhartInfo(request: Request, response: Response): void{
    response.status(200);
    response.send({
      firstName: 'Jürgen',
      lastName: 'Geiselhart',
      optionalAttribute: 'Student | 4. Semester ',
      optionalAttribute1: 'B.Sc. Informatik',
      optionalAttribute2: 'juergen.geiselhart@uni-konstanz.de'
    });
  }

  public getMaxGaletskiyInfo(request: Request, response : Response) : void {
    response.status(200);
    response.send({
      firstName: 'Max',
      lastName: 'Galetskiy',
      optionalAttribute: 'Student | 4. Semester ',
      optionalAttribute1: 'B.Sc. Informatik',
      optionalAttribute2: 'max.galetskiy@uni-konstanz.de'
    });
  }

  public getTimBleileInfo(request: Request, response : Response) : void {
    response.status(200);
    response.send({
      firstName: 'Tim',
      lastName: 'Bleile',
      optionalAttribute: 'Student | 4. Semester ',
      optionalAttribute1: 'B.Sc. Informatik',
      optionalAttribute2: 'tim.bleile@uni-konstanz.de'
    });
  }

  public getPatrickStoerkInfo(request: Request, response: Response): void {
    response.status(200);
    response.send({
      firstName: 'Patrick',
      lastName: 'Stoerk',
      optionalAttribute: 'Student | 4. Semester ',
      optionalAttribute1: 'B.Sc. Informatik',
      optionalAttribute2: 'patrick.stoerk@uni-konstanz.de'
    });
  }

  public postNameInfo(request: Request, response: Response): void {
    response.status(200);
    response.send('ok');
  }
  public getLuisaMuellerInfo(request: Request, response: Response): void {
      console.log('✅ HIT /api/luisa-mueller');

    response.status(200);
    response.send({
      firstName: 'Luisa',
      lastName: 'Mueller',
      optionalAttribute: 'Studentin | 5. Semester ',
      optionalAttribute1: 'B.Sc. Informatik',
      optionalAttribute2: 'luisa.mueller@uni-konstanz.de'
    });
  }
  public getAdrianSopioInfo(request:Request, response: Response): void {
    response.status(200);
    response.send({
      firstName: 'Adrian',
      lastName: 'Sopio',
      optionalAttribute: 'Student | 4. Semester ',
      optionalAttribute1: 'B.Sc. Informatik',
      optionalAttribute2: 'adrian.sopio@uni-konstanz.de'
    });
  }

}

