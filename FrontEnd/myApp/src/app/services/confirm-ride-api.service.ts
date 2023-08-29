import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmRideApiService {

  constructor(private http:HttpClient) { }
  storeNotification(data:any){
   return this.http.post('http://localhost:3000/notification/storeNotifications', data) 
  }
  getNotification(){
    return this.http.get('http://localhost:3000/notification/getNotifications')
  }
}
