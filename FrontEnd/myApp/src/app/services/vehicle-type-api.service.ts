import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeApiService {
  
  constructor(private http:HttpClient) { }

  storeVehicleType(vehicleData:any){  
    return this.http.post('http://localhost:3000/vehicle/storeVehicleType',vehicleData)
    }
  getVehicleType(){
    return this.http.get('http://localhost:3000/vehicle/getVehicleType')
  }
  // fetchVehicleType(vehicleId:string){
  //   return this.http.get(`http://localhost:3000/vehicle/fetchVehicleType/${vehicleId}`)
  // }
  updateVehicleType(updateData:any){
    return this.http.post(`http://localhost:3000/vehicle/updateVehicleType`,updateData)
  }
}