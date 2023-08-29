import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CardApiService {

  constructor(private http:HttpClient) { }
  storeCard(card: any){
    return this.http.post('http://localhost:3000/card/storeCard',card)
  }
  getCard(){
    return this.http.get('http://localhost:3000/card/getCard')
  }  
}
