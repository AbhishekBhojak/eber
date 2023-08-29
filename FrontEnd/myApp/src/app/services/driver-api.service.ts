import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DriverApiService {

  constructor(private http:HttpClient) { }
  storeDriver(driver:any){
    return this.http.post('http://localhost:3000/driver/storeDriver',driver)
  }
  find(data:any){
    return this.http.post('http://localhost:3000/driver/findDriver',data)
  }
  getDriver(data:any){
    return this.http.post('http://localhost:3000/driver/getDriver',data)
  }
  updateDriver(driver:any){
    return this.http.put('http://localhost:3000/driver/updateDriver',driver)
  }
  deleteDriver(driver:any){
    return this.http.post('http://localhost:3000/driver/deleteDriver',driver)
  }
  getDriverList(){
    return this.http.get('http://localhost:3000/driver/getDriverList')
  }
  findDriverForTrip(data:any){
    return this.http.post('http://localhost:3000/driver/findDriverForTrip',data)
  }
  setTripForDriver(data:any){
    return this.http.post('http://localhost:3000/driver/setTripForDriver',data)
  }
}
