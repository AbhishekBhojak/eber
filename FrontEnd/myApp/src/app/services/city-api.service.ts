import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityApiService {

  constructor(private http:HttpClient) { }
  storeCity(city:any){
    return this.http.post('http://localhost:3000/city/store',city)
  }
  getCity(){
    return this.http.get('http://localhost:3000/city/get')
  }
  updateCity(city:any){
    return this.http.put('http://localhost:3000/city/update',city)
  }
}
