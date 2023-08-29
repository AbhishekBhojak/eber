import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingApiService {
settingData:any
  constructor(private http:HttpClient) { }
  getMessage(){
     var data=this.http.get('http://localhost:3000/setting/getSetting')
    this.settingData=data
    return data
  }
  updateMessage(data:any){
    this.settingData=this.http.post('http://localhost:3000/setting/updateSetting',data)
    return this.settingData
  }
  getServiceData(){
    if(this.settingData){
      return this.settingData
    }else{
      return this.getMessage()
    }
  }
}
