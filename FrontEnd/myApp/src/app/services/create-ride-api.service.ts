import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateRideApiService {
  constructor(private http: HttpClient) { }
  storeCreateRide(data: any) {
    return this.http.post('http://localhost:3000/createRide/store', data)
  }
  // storeNotification(data: any) {
  //   return this.http.post('http://localhost:3000/createRide/notification',data)
  // }
  // getNotification() {
  //   return this.http.get('http://localhost:3000/createRide/getNotification')
  // }
  searchInfo(data: any) {
    return this.http.post('http://localhost:3000/createRide/searchInfo', data)
  }
  showCreateRide(data: any) {
    return this.http.post('http://localhost:3000/createRide/getCreateRide', data)
  }
  setDriverForTrip(data: any) {
    return this.http.post('http://localhost:3000/createRide/setDriverForTrip', data)
  }
  findDataByDate(data: any) {
    return this.http.post('http://localhost:3000/createRide/findDataByDate', data)
  }
  findRequestedTrip() {
    return this.http.get('http://localhost:3000/createRide/findRequestedTrip')
  }
  cancelRequest(data: any) {
    return this.http.post('http://localhost:3000/createRide/cancelRequest', data)
  }
  acceptRequest(data: any) {
    return this.http.post('http://localhost:3000/createRide/acceptRequest', data)
  }
  findCancelledTrip(data:any) {
    return this.http.post('http://localhost:3000/createRide/findCancelledTrip',data)
  }
  findReassignedRide(){
    return this.http.get('http://localhost:3000/createRide/findReassignedRide')
  }
  // downloadTrip(data:any){
  //   return this.http.post('http://localhost:3000/createRide/downloadTrip', data)
  // }
}
