import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router'
@Injectable({
  providedIn: 'root'
})
export class LoginApiService {
userData: any;
mouseEvent: any;
message:any
notification: any;
keypressEvent: any;
  constructor(private router:Router,private http:HttpClient) { }
  findAdmin(data:any){
    return this.http.post('http://localhost:3000/login/findAdmin',data)
  }  
  storeAdmin(data:any) {
    return this.http.post('http://localhost:3000/login/storeAdmin',data)
  }
  showMessage(data:any){
    var backgroundColor='red'
    if(data.bool){
      backgroundColor='green'
    }
    if(data.color){
      backgroundColor=data.color
    }
    this.message=document.getElementById('message')
    this.message.style.backgroundColor = backgroundColor
    this.message.innerHTML=data.message
    this.message.style.display='flex'
    setTimeout(() => {
      this.message.style.display='none'
    }, 3000);
  }
  showNotification(data:any){
    this.notification=document.getElementById('notification')
    var driverName
    if(data.driverName){
      driverName = data.driverName
    }else{
      driverName =''
    }
    this.notification.innerHTML=`<div>
   <img
    style=" height: 4vh;
    position: absolute;
    left: 22px;
    top: 24px;"
    src="http://localhost:3000/images/uploaddriver/1691630027448eber.webp"
  />
    <p style="font-size:20px;font-weight:bold;margin-top:4px">From Eber</p>
    <p style="font-size:15px;margin-top:3px">Driver ${driverName} not Accepted Request<p/>`
    // <p style="font-size:15px;margin-top:4px">For passenger ${data.userName}'s trip<p/>
    //     </div>`
    this.notification.style.display='flex'
    setTimeout(() => {
      this.notification.style.display='none'
    }, 3000);
  }
  // hideMessage(){
  //   this.message=
  // }
}
