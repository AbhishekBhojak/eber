import { Component,EventEmitter,OnInit,Output } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  @Output() menuHideEvent = new EventEmitter();
  visibleMenu: boolean = false;
  hidemenu: boolean = true;
  ngOnInit(){
    this.hidemenu=true
  }
  logOut(){
    this.menuHideEvent.emit(false)
  }
  showMenu(){
    this.visibleMenu=true;
  }
  hideMenu(){
  this.visibleMenu=false
  }
  
}
