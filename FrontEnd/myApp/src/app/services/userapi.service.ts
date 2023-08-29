import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserapiService {

  constructor(private http:HttpClient) { }
  storeUser(user:any){
    return this.http.post('http://localhost:3000/user/storeUser',user)
  }
  getUser(data:any){
    return this.http.post('http://localhost:3000/user/getUser',data)
    
  }
  updateUser(user:any){
    return this.http.put('http://localhost:3000/user/updateUser',user)
  }
  deleteUser(userId:any){
    return this.http.post(`http://localhost:3000/user/deleteUser`,userId)
  }
  getUserNumber(userNumber:any){
   var data=userNumber.userPhone
   var solve
    return this.http.get(`http://localhost:3000/user/getUserNumber/${data}`)
  }
}
