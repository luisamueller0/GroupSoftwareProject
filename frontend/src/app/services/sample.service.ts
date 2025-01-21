import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SampleService {
  public globalText = 'Dieser Text wird in einem Service verwaltet und ist somit unabhängig von Komponenten.';

  constructor() { }
}
