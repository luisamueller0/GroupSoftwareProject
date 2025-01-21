import { Component, EventEmitter, Input, Output,ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent {
  @ViewChild('inputField') inputField!: ElementRef;

  @Input()
  invalid = false;    // used for making the borders red

  /**
   *  Wenn ein Attribut (z.B. "label") mit "@Input" markiert wird, kann dieses Attribut von anderen Komponenten
   *  via HTML gesetzt werden. In diesem Fall kann die Komponente so verwendet werden:
   *
   *  <app-user-input [label]="myVariable"></app-user-input>
   *      ↑             ↑              ↑                  ↑
   *  Selektor der      |        Der Wert, auf den        |
   *  am Anfang         |        das Attribut gesetzt     |
   *  dieser Datei      |        wird. Bitte beachten:    |
   *  definiert wird    |        Durch die [eckigen       |
   *                    |        Klammern] wird explizit  |
   *                    |        auf eine Variable        |
   *                    |        verwiesen!               |
   *                    |                                 |
   *          Die definierte Variable                 Angular Komponenten können
   *          kann in dem HTML Code                   nicht 'selbstschließend' sein
   *          dann verwendet werden.                  (d.h. <app-user-input /> ist nicht
   *          Der Name der Variable wird              zulässig).
   *          automatisch erkannt und
   *          übernommen.
   */
  @Input()
  label = '';

  // Used to show errormessage of the inputfield
  @Input()
  msg = '';


  /**
   *  Anstatt einer Variable können diesen "@Input" Properties auch direkt Daten gegeben werden, indem die [eckigen Klammern]
   *  bei der Verwendung weggelassen werden:
   *
   *  <app-user-input type="password"></app-user-input>
   *                    ↑       ↑
   *   +----------------+       +--------------+
   *   |                                       |
   *  Wenn wir hier nicht [type]          Password ist in diesem
   *  sondern nur type schreiben,         Fall keine Variable,
   *  können wir einen String oder        sondern wird als
   *  anderen Wert statt einer            String 'password'
   *  Variable übergeben                  weitergereicht
   *
   *
   *  Spezifisch für diese Variable wollen wir nicht nur *irgendeinen* String, sondern ein Wert der von dem <input> HTML Element
   *  als Typ akzeptiert wird. Damit wir also ein gescheites Autocomplete bekommen, schränken wir den Wert hier beispielsweise
   *  auf drei verschiedene String-Werte ein: Entweder 'text', oder 'number', oder 'password'.
   */
  @Input()
  type: 'date' | 'text' | 'number' | 'password' = 'text';


  /**
   *  Da wir die 'text' Property an eine <input> Komponente weitergeben, wollen wir Änderungen, die der Nutzer eingibt,
   *  auch wieder in unsere 'text' Property zurückerhalten. Dazu ist ein "Two-Way Data Binding" notwendig, d.h. dass *sowohl*
   *  Änderungen die der Komponente gegegeben werden reflektiert, *als auch* Änderungen die die Komponente an der Property
   *  vornimmt wieder zurückgegeben werden.
   *  Damit das realisiert wird, brauchen wir sowohl eine Property, die mit "@Input" markiert wird, und eine
   *  "EventEmitter" Property, der mit "@Output" markiert wird. Dieser "EventEmitter" muss dem Namensschema "<property>Change"
   *  folgen: wenn z.B. unsere "@Input" variable myInput heißt, *muss* der EventEmiiter "myInputChange" heißen.
   *
   *  Um das "Two-Way Data Binding" zu verwenden, muss man sowohl eckige als auch normale Klammern im HTML Code verwenden:
   *  <app-user-input [(text)]="myTextVariable"></app-user-input>
   *                    ↑
   *  Hiermit markieren wir dass wir Änderungen, die von <app-
   *  user-input> gemacht werden auch wieder zurück erhalten wollen.
   *  ("Two-Way Data Binding")
   */
  @Input()
  number = 0;
  @Output()
  numberChange = new EventEmitter<number>();

  // @Input()
  // date = '';
  // @Output()
  // dateChange = new EventEmitter<string>();

  @Input()
  text = '';
  @Output()
  textChange = new EventEmitter<string>();
  /**                             ↑  */
  /**              Der EventEmitter sollte hier den gleichen Typ haben, wie die passende "@Input" Variable  */


  /**
   *  Damit das "two-way data binding" funktioniert, muss der geänderte Text wieder zurückgeschickt werden.
   *  Diese Methode wird von Angular aufgerufen, sobald sich der Text in der Input Methode ändert (siehe
   *  HTML Code in "user-input.component.html"):
   *  <input [type]="type" [(ngModel)]="text" (ngModelChange)="onTextChange()">
   *                            ↑                    ↑
   *     +----------------------+                    |
   *     |
   *  Hier findet wieder ein "two-way           Sobald sich der Text ändert (z.B. wenn der Benutzer
   *  Data binding" statt, wir übergeben        etwas in das Textfeld schreibt) wird die "onTextChange"
   *  die "text" Variable weiter an die         Methode aufgerufen. Falls Methoden aufgerufen werden sollen,
   *  Input Komponente.                         markieren wir das mit den normalen Klammern: (ngModelChange)
   */
  @Output() enterKeyPressed = new EventEmitter<void>();

  showPassword = false; // Variable to control password visibility

  onEnterKeyPressed(): void {
    this.enterKeyPressed.emit();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }



  onTextChange(): void {
    if (this.type === 'number') {
      const parsedNumber = parseFloat(this.text);
      if (!isNaN(parsedNumber)) {
        this.number = parsedNumber;
      }
      else {
        this.number = Number.NEGATIVE_INFINITY;
      }
      this.numberChange.emit(this.number);
    }
    else {
      this.textChange.emit(this.text);
    }
  }
  remove(): void {
    this.text = '';
    this.number = 0;
    this.onTextChange();
    this.focusInputField();
  }
  private focusInputField(): void {
    if (this.inputField && this.inputField.nativeElement) {
      this.inputField.nativeElement.focus();

  }
}

}
