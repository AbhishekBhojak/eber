import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehiclePriceApiService {

  constructor(private http:HttpClient) { }
  storeVehiclePrice(data:any){
    return this.http.post('http://localhost:3000/vehiclePrice/storeVehiclePrice',data)
  }
  getVehiclePrice(){
    return this.http.get('http://localhost:3000/vehiclePrice/getVehiclePrice')
  }
}
