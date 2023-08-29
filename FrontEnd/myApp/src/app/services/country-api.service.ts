import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryApiService {

  constructor(private http:HttpClient) { }
  // getCountry(){
  // // return  this.http.get('https://restcountries.com/v3.1/all')
  // }
  searchCountry(country:any){
    return this.http.post('http://localhost:3000/country/searchcountry',country)
  }
  findCountry(country:any){
    return this.http.post('http://localhost:3000/country/findcountry',country)
  }
  storeCountryData(countryDat:any){
    return this.http.post('http://localhost:3000/country/storeCountryData',countryDat)
  }
  showAllCountryData(){
    return this.http.get('http://localhost:3000/country/allCountryData')
  }  
}
