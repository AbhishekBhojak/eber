import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginApiService } from './login-api.service';
@Injectable({
  providedIn: 'root'
})

export class SessionService {
  constructor(private http:HttpClient, private loginApiService:LoginApiService )  { }
  storeSession() {
    var expiry=new Date(Date.now()+1000*20*60)
    // var expiry=new Date(Date.now()+10000)
    const data={
      name:'admin',
      expirationTime:expiry
    }
     localStorage.setItem('sessionData', JSON.stringify(data));
  }
  getSession(): any {
      var sessionData=localStorage.getItem('sessionData');
      
      return sessionData
  }
  // Clear session data from local storage
  clearSession() {
    console.log('removeed');
    
    localStorage.removeItem('sessionData');
  }

  calculate(data:any){
    var session=JSON.parse(data)
    var expiry:any = new Date(session.expirationTime)
    var diff= expiry-Date.now()
    return diff
  }

  validateSession():any{
    const data=this.getSession()
    if(data)
    {
      var diff= this.calculate(data)
      var temp:any=Number((diff/1000).toFixed(0))
      if(temp>0){
        // this.storeSession()
        // var data0 = this.getSession()
        // var diff0= this.calculate(data0)
        return {success:true,expiry:diff}
      }else{
        this.clearSession()
      // this.loginApiService.showMessage({message:'logged out'})

        return {success:false}

      }
    }else{
      return {success:false}
    }        
  }
}
