import { Component,OnInit } from '@angular/core';
// import  from 'papaparse';
import * as Papa from 'papaparse';
import { json } from 'express';
import { CreateRideApiService } from 'src/app/services/create-ride-api.service';
import { SessionService } from 'src/app/services/session.service';
import { LoginApiService } from 'src/app/services/login-api.service';
import { LoaderService } from 'src/app/services/loader.service';
declare let google:any
declare let geocoder:any
@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent {
  rideList:any=[]
  adminCancelled:any=''
  showmg:boolean=false
  showgm:boolean=false
  map:any
  searchQuery:any=''
  showMap:boolean=false
  stopList:any=[]
  fromLocation:any=''
  toLocation:any=''
  selectedData:any={}
  tripData:any=[]
  pickup:any=''
  drop:any=''
  pageLimit:any=5
  pageList:any=[]
  fromDt:any=''
  toDt:any=''
  pageCount:any
  pageNo:any=1
  downloadBtn:any={href:""}
  directionsRenderer:any
  isdownloadable:boolean=false
  dwnbtn:boolean=false
  directionsService:any
constructor(private sessionApi:SessionService,private createRideApi:CreateRideApiService,private loginapi:LoginApiService,private loaderApi:LoaderService){}
ngOnInit() {
this.loaderApi.show()
  this.getRideHistory()
  setTimeout(() => {
    this.loadMap()
  }, 1000)
}
geocodeAddress(address:any) {
  var geocoder=new google.maps.Geocoder()
  geocoder.geocode({ address: address }, (results:any, status:any)=> {
    if (status === google.maps.GeocoderStatus.OK) {
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
hideDetails(){
  this.showMap=false
}
onSelectRequest(data:any){ 
  // this.downloadBtn!=null
  this.showMap=true
  this.selectedData=data
  // var data:any=JSON.stringify(this.selectedData)
  this.fromLocation=data.pickUp
  this.toLocation=data.drop
  this.stopList=data.stopList
  this.geocodeAddress(data.pickUp)
  this.removePath()
  // this.removeMarker()
  this.drawPath()
  var datas=[this.selectedData]
  datas.push()
  if(data.currentStatus=='completed'){
    // this.downloadBtn!=null
  // this.downloadBtn= document.getElementById('a');
  // console.log(this.downloadBtn);
  
// console.log(this.isdownloadable);
  var TripData=datas.map((obj:any)=>{
    return {
      from:obj.pickUp,
      to:obj.drop,
      userName:obj.userId.userName,
      userNumber:obj.userId.userPhone,
      userEmail:obj.userId.userEmail,
      driverName:obj.driverId.driverName,
      driverNumber:obj.driverId.driverPhone,
      time:obj.time,
      distance:obj.distance,
      duration:obj.duration,
      cost:obj.serviceCost,
      paymentType:obj.paymentType,
      stops:obj.stopList,
      tripType:data.currentStatus,
    }  
  })
  this.isdownloadable=true
  this.download(TripData)
}
else{
  this.isdownloadable=false
}

// const csv=Papa.unparse(this.tripData)
// const blob = new Blob([csv], { type: 'text/csv' });
// this.downloadBtn.href = URL.createObjectURL(blob);
// this.downloadBtn.download = 'data.csv';
// this.downloadBtn.textContent = 'Download Trip';
// const container:any = document.getElementById('download');
// container.appendChild(this.downloadBtn);
}
downloadAllTrips(){
  console.log(this.rideList);  
  var datas=this.rideList
  // datas.push()
  var driverName
  var driverNumber
  var TripData=datas.map((obj:any)=>{
    if(obj.driverId!=null){
      driverName=obj.driverId.driverName
      driverNumber=obj.driverId.driverPhone
    }else{
      driverName='not available'
      driverNumber='not available'
    }
    return {
      from:obj.pickUp,
      to:obj.drop,
      userName:obj.userId.userName,
      userNumber:obj.userId.userPhone,
      userEmail:obj.userId.userEmail,
      driverName:driverName,
      driverNumber:driverNumber,
      time:obj.time,
      distance:obj.distance,
      duration:obj.duration,
      cost:obj.serviceCost,
      paymentType:obj.paymentType,
      stops:obj.stopList,
      
    }  
  })
  // console.log(TripData);
  this.downloadall(TripData)
  // this.tripDownloadMessage()
}
download(data:any){
  setTimeout(() => {
    var anchor:any= document.getElementById('abc');  
  const csv=Papa.unparse(data)
const blob = new Blob([csv], { type: 'text/csv' });
anchor.href = URL.createObjectURL(blob);
anchor.download = 'data.csv';
anchor.textContent = 'Download Trip';
  }, 200);
}
downloadall(data:any){
  setTimeout(() => {
    var anchor:any= document.getElementById('abb');  
  const csv=Papa.unparse(data)
const blob = new Blob([csv], { type: 'text/csv' });
anchor.href = URL.createObjectURL(blob);
anchor.download = 'data.csv';
anchor.textContent = 'Download Trip';
  }, 200);
  this.dwnbtn=true;
}
loadMap() {
  this.map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 12
  });
  this.loaderApi.hide()
}
showData(data: any) {
}
tripDownloadMessage(){
  this.loginapi.showMessage({message:'Trip Downloaded',bool:true})
  this.dwnbtn=false
}
onChangeLimit(){
  this.pageNo=1
this.getRideHistory()
}
drawPath(){
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  var stops:any=[]
  directionsRenderer.setMap(this.map);
  this.stopList.forEach((stop:any) => {
    var data
    data={location:stop,stopover:true}
    stops.push(data);
  })
  // console.log(stops);
    const request = {
      origin: this.fromLocation,
      destination: this.toLocation,
      waypoints:stops,
      travelMode: "DRIVING",
    };
    directionsService.route(request,(result:any, status:any)=> {
      if (status == "OK") {
        directionsRenderer.setDirections(result);
      } else {
        alert("Directions request failed due to " + status);
      }
    });
  this.directionsRenderer=directionsRenderer
}
searchDate(){
  var fromDate=this.fromDt
  var toDate=this.toDt
  console.log(fromDate);
  var datefrom=new Date(fromDate)
  console.log(datefrom.toISOString());
  var dateto=new Date(toDate)
  var from=datefrom.toLocaleDateString()
  var to=dateto.toLocaleDateString()
  console.log(from);
  console.log(to);
  this.fromDt=from
  this.toDt=to
  if(fromDate!='' && toDate!=''){
    this.getRideHistory()
  }else{
    return
  }
}
removePath(){
  if(this.directionsRenderer){
    this.directionsRenderer.setMap(null);
    // this.directionsRenderer=null
  }
}
getWords(paragraph:any){
  console.log(paragraph);
  var words = paragraph.pickUp.split(" ");
  var add
for (var i = 0; i < words[4]; i++) {
    return add=words[i]
}
}
getRideHistory(pg?:any){
  if (pg) {
    if (pg == this.pageNo) {
      return
    }
    this.pageNo = pg
  }
  var data:any={
    pagelimit:Number(this.pageLimit),
    pageno:Number(this.pageNo),
    query:this.searchQuery
  }
  if(this.fromDt!='' && this.toDt!=''){
    data.to=this.toDt
    data.from=this.fromDt
  }
  this.createRideApi.findCancelledTrip(data).subscribe((data:any) => {
    // this.loaderApi.hide()
    console.log(data);
    this.rideList=data.data
    this.fromDt=''
    this.toDt=''
    this.adminCancelled='Admin Cancelled'
    this.countPages(data.count)
    this.rideList.forEach((element:any, index:any) => {
      if(element.driverId==null){
        this.showmg=true
        this.showgm=false
        this.rideList[index].cancelled= "Admin Cancelled"
      }else{
        this.rideList[index].cancelled= element.driverId.driverName
        this.showgm=true
        this.showmg=false
      }
    }); 

    // console.log(stops);
    // this.pickup=stops.pickup[4]
    // console.log(this.pickup);
    //  var pickup=this.getWords(stops[0])
    //  console.log(pickup);
  })

}
countPages(page:any){
  console.log(page)
  this.pageList=[]
  var pages=page/this.pageLimit
  if(page%this.pageLimit){
    pages++
  }
  for(var i=1; i<=pages; i++){
    this.pageList.push(i)
  }
}
}
