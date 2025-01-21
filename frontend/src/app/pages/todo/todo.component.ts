import { Component, OnInit } from '@angular/core';
import { SampleService } from 'src/app/services/sample.service';

@Component({
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  /**
   *  Damit der Text in der HTML Komponente bereitsteht, legen wir den Text als 'public' fest.
   */
  public text = 'Dieser Text wird zwischen zwei Komponenten synchronisiert!';

  /**
   *  Hier definieren wir ein Array von Objekten für Links. Damit das HTML Template (landingpage.component.html)
   *  auch Zugriff auf dieses Attribut hat, deklarieren wir es als public. Der Typ dieses Attributs definieren wir
   *  als Array [] von Objekten {}, die einen "name" String und einen "url" String haben.
   */
  public links: {name: string, url: string }[] = [
    { name: 'Overview: HTML', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' },
    { name: 'Overview: CSS', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS' },
    { name: 'Overview: JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript' },
    { name: 'Getting Started with Typescript', url: 'https://www.typescriptlang.org/docs/' },
    { name: 'Angular Homepage', url: 'https://angular.io/' },
    { name: 'Angular Documentation', url: 'https://angular.io/docs' },
    { name: 'Learn Angular', url: 'https://angular.io/tutorial' }
  ];

  /**
   *  Wie bei den Services wird auch in den Komponenten der Konstruktor über Angular aufgerufen.
   *  D.h. wir können hier verschiedene Services spezifizieren, auf die wir Zugriff haben möchten, welche
   *  automatisch durch "Dependency injection" hier instanziiert werden.
   */
  constructor(public sampleService: SampleService) { }

  /**
   *  Da unsere Komponente das "OnInit" Interface implementiert müssen wir eine "ngOnInit" Methhode implementieren.
   *  Diese Methode wird aufgerufen, sobald der HTML code dieser Komponente instanziiert und aufgebaut wurde
   *  (quasi wie ein zweiter Constructor, der von Angular automatisch aufgerufen wird).
   *  Weiterführende Infos gibt es hier: https://angular.io/guide/lifecycle-hooks
   */
  ngOnInit(): void {
    console.log('LandingPage initialized!');
  }


}
