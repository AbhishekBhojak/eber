import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }
  
  show() {
    var loader:any=document.getElementById('loader')
    loader.style.display="flex";
  }

  hide() {
    var loader:any=document.getElementById('loader')
    loader.style.display="none";
  }
}
