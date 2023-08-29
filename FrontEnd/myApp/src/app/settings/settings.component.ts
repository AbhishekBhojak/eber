import { Component,OnInit } from '@angular/core';
import {SettingApiService} from '../services/setting-api.service'
import {SessionService} from '../services/session.service'
import { LoginApiService } from '../services/login-api.service';
import { LoaderService } from '../services/loader.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
selectTime:any
selectStop:any
settingData:any={}
currentTime:any
ngOnInit() {
  this.getSetting()
  this.loaderApi.show()
}
constructor(private settingApi:SettingApiService,private sessionApi:SessionService,private loginApi:LoginApiService,private loaderApi:LoaderService){}

getSetting(){
  this.settingApi.getMessage().subscribe((data:any) =>{
    console.log(data);
    this.loaderApi.hide()
  this.settingData=data 
  })
}

updateSetting(str:any){
  var data=new FormData()
    // this.sendData.id=this.settingData._id
    data.append('id',this.settingData._id)
    if(str=='Time'){
      // this.sendData.time=this.selectTime
      data.append('time',this.selectTime)
    } 
    if(str=='Stop'){
      // this.sendData.stops=this.selectStop
      data.append('stops',this.selectStop)
    }
  this.loaderApi.show()
  this.settingApi.updateMessage(data).subscribe((data:any)=>{
    this.loaderApi.hide()
    if(data.success){
      this.getSetting()
      this.loginApi.showMessage({message: `${str} Updated`,bool:true})
      this.settingData=data.res
    }else{
      this.loginApi.showMessage({message: 'something went wrong'})
    }
  })
}
}
