import { Component } from '@angular/core';
import { min } from 'rxjs';
import {CityApiService} from 'src/app/services/city-api.service'
import {CountryApiService} from 'src/app/services/country-api.service'
import { LoaderService } from 'src/app/services/loader.service';
import { LoginApiService } from 'src/app/services/login-api.service';
import { SessionService } from 'src/app/services/session.service';
import {VehiclePriceApiService} from 'src/app/services/vehicle-price-api.service'
import {VehicleTypeApiService} from 'src/app/services/vehicle-type-api.service'
@Component({
  selector: 'app-vehicle-price',
  templateUrl: './vehicle-price.component.html',
  styleUrls: ['./vehicle-price.component.css']
})
export class VehiclePriceComponent {
  driverProfit:any=''
  vehiclePriceData:any={}
  dbVehiclePriceData:any=[]
  minFare:any=''
  showTable:boolean=true
  distance:any=''
  basePrice:any=''
  distanceUnit:any=''
  timeUnit:any=''
  maxSpace:any=''
  selectedCity:any
  selectedCountry:any={success:false}
  selectedVehicle:any
  showCityList:boolean = false
  addButton:boolean = true
  showVehicleForm:boolean = true
  cityList:any=[]
  countryList:any=[]
  vehicleList:any=[]
  totalAmount:any
  isCountry:boolean=false
  isCity:boolean=false
  isVehicle:boolean=false
  isDriverProfit:boolean=false
  isMinfare:boolean=false
  isBasePrice:boolean=false
  isDistanceUnit:boolean=false
  isTimeUnit:boolean=false
  isDistance:boolean=false
  isMaxSpace:boolean=false
  constructor(private cityApi:CityApiService,private countryApi:CountryApiService,private vehiclePriceApi:VehiclePriceApiService,private vehicleTypeApi:VehicleTypeApiService,private sessionApi:SessionService,private loginApi:LoginApiService,private loaderApi:LoaderService){}
  ngOnInit():void{
    this.loaderApi.show()
    this.getVehiclePriceData()
    this.getCountry()
    this.onGetCity()
    this.onGetVehicleList()
  }
  getCountry(){
    this.countryApi.showAllCountryData().subscribe((data:any)=>{
      this.countryList=data
      console.log(this.countryList)
    })
  }
  onGetCity(){
    this.cityApi.getCity().subscribe((data:any)=>{
      this.cityList=data
      console.log(this.cityList)
    })
  }
  onGetVehicleList(){
    this.vehicleTypeApi.getVehicleType().subscribe((data)=>{
      this.loaderApi.hide()
      console.log(data)
      this.vehicleList=data
    })
  }
  onSelectCountry(){
    
    this.showCityList=true
    console.log(this.selectedCountry.countryName)
    // console.log(this.selectedCity.countryName)
    // console.log(this.selectedVehicle.vehicleName)

  }
  cancelBtn(){
  this.emptyFields()  
  this.emptyMessage()
  }
  emptyFields(){
    this.selectedCountry={success:false}
    this.selectedCity=null
    this.selectedVehicle=null
    this.driverProfit=''
    this.minFare=''
    this.distance=''
    this.basePrice=''
    this.distanceUnit=''
    this.timeUnit=''
    this.maxSpace=''
  }
  emptyMessage(){
    this.isBasePrice=false
    this.isCity=false
    this.isCountry=false
    this.isDistance=false
    this.isDistanceUnit=false
    this.isDriverProfit=false
    this.isMaxSpace=false
    this.isMinfare=false
    this.isTimeUnit=false
    this.isVehicle=false
  }
  notEmpty(fld:any){
    switch(fld){
      case 'dp':{
        if(this.driverProfit!=''){
          this.isDriverProfit=false
          break;
        }
        else{
          this.isDriverProfit=true
          break;
        }
      }
      case 'mf':{
        if(this.minFare!=''){
          
            this.isMinfare=false
          break;
        }else{
          this.isMinfare=true
          break;
        }
      }
      case 'bp':{
        if(this.basePrice!=''){
          this.isBasePrice=false
          break;
        }else{
          this.isBasePrice=true
          break;
        }
      }
      case 'bpd':{
        if(this.distanceUnit!=''){
          this.isDistanceUnit=false
          break
        }else{
          this.isDistanceUnit=true
          break;
        }
      }
      case 'udp':{
        if(this.timeUnit!=''){
          this.isTimeUnit=false
          break
        }else{
          this.isTimeUnit=true
          break;
        }
      }
      case 'utp':{
        if(this.distance!=''){
          this.isDistance=false
          break
        }else{
          this.isDistance=true
          break;
        }
      }
      case 'ms':{
        if(this.maxSpace!=''){
          this.isMaxSpace=false
          break
        }else{
          this.isMaxSpace=true
          break;
        }
      }
      case 'country':{        
        if(this.selectedCountry._id){
          this.isCountry=false
          break
        }else{
          this.isCountry=true
          break;
        }
      }
      case 'city':{
        if(this.selectedCity!=''){
          this.isCity=false
          break
        }else{
          this.isCity=true
          break;
        }
      }
      case 'vehicle':{
        if(this.selectedVehicle!=''){
          this.isVehicle=false
          break
        }else{
          this.isVehicle=true
          break;
        }
      }
    }  
  }
  storeVehiclePriceData(){
    if((this.minFare!='' && this.driverProfit!='' && this.distance!='' && this.basePrice!='') && (this.distanceUnit!='' && this.timeUnit!='' && this.maxSpace!='' && this.selectedCountry.success!=false && this.selectedCity!=null && this.selectedVehicle!=null)){
    this.vehiclePriceData={
      countryId:this.selectedCountry._id,
      cityId:this.selectedCity._id,
      vehicleTypeId:this.selectedVehicle._id,
      driverProfit:this.driverProfit,
      minFare:this.minFare,
      distance:this.distance,
      basePrice:this.basePrice,
      distanceUnit:this.distanceUnit,
      timeUnit:this.timeUnit,
      maxSpace:this.maxSpace,
    }
    this.loaderApi.show()
    this.vehiclePriceApi.storeVehiclePrice(this.vehiclePriceData).subscribe({next:(data:any)=>{
      this.loginApi.showMessage({message:data.message,bool:data.success})
      this.getVehiclePriceData()
      this.emptyFields()
      console.log(data)
    },error:(err)=>{
      // console.log(err)
    }
  })
}else{
  
  if(this.selectedCountry.success==false){this.isCountry=true}else{this.isCountry=false
  }
  if(this.selectedCity==null){this.isCity=true}else{this.isCity=false}
  if(this.selectedVehicle==null){this.isVehicle=true}else{this.isVehicle=false}
  if(this.driverProfit==''){this.isDriverProfit=true}else{this.isDriverProfit=false}
  if(this.minFare==''){this.isMinfare=true;}else{this.isMinfare=false;}
  if(this.distance==''){this.isDistance=true}else{this.isDistance=false}
  if(this.basePrice==''){this.isBasePrice=true}else{this.isBasePrice=false}
  if(this.distanceUnit==''){this.isDistanceUnit=true}else{this.isDistanceUnit=false}
  if(this.timeUnit==''){this.isTimeUnit=true}else{this.isTimeUnit=false}
  if(this.maxSpace==''){this.isMaxSpace=true;}else{this.isMaxSpace=false}
}

  }
  getVehiclePriceData(){
    this.vehiclePriceApi.getVehiclePrice().subscribe({next:(data)=>{
      this.loaderApi.hide()
      console.log(data)
      this.dbVehiclePriceData=data
    },error:(err)=>{
      console.log(err)
    }})
  }
}
