import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { CreateRideApiService } from 'src/app/services/create-ride-api.service';
import { DriverApiService } from 'src/app/services/driver-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SocketService } from 'src/app/services/socket.service';
import { LoginApiService } from 'src/app/services/login-api.service';
import { ConfirmRideApiService } from 'src/app/services/confirm-ride-api.service';
@Component({
  selector: 'app-confirm-ride',
  templateUrl: './confirm-ride.component.html',
  styleUrls: ['./confirm-ride.component.css']
})
export class ConfirmRideComponent {
  createRideDataList: any = []
  filterRequest: any
  showBtn: boolean = true
  isDialogBox: boolean = false
  driverList: any = []
  socket: any
  searchBy: any = ''
  searchField: any = ''
  rideStatus: any = ''
  driver: any
  pageNo:any=1
  pageLimit: any=6
  fromDt:any=''
  toDt:any=''
  closeNotify:boolean=false
  pageList:any=[]
  driverId: any = ''
  noDataToShow='no data to show'
  tripId: any = ''
  notificationCounter:any=''
  notificationList:any=[]
  notificationbunch:any=[]
  cancelBtn: boolean = false
  hideNearestDriverBtn: boolean = true
  isRequestInfo: boolean = false
  showTable: boolean = true
  allAddresses: any = []
  constructor(private sessionApi: SessionService, private createRideApi: CreateRideApiService, private DriverApi: DriverApiService, private loaderApi: LoaderService, private socketService: SocketService,private loginApi:LoginApiService,private confirmRideApi:ConfirmRideApiService) { }
  ngOnInit() {
    this.loaderApi.show()
    this.getCreateRideList()
    // this.storeNotification()
    // this.loginApi.showNotification()
    // setTimeout(() => {
      this.socket = this.socketService.getSocket()
      this.socket.on('Booked', (data: any) => {
        this.getCreateRideList()
        this.rideStatus = data.status
      })
      // setTimeout(() => {
      this.socket.on('notification', (data:any) => {
        this.notificationbunch=data
        var datas={
          driverName:data.driverId.driverName,
          userName:data.userId.userName,
        }
        this.loginApi.showNotification(datas)
        this.findReassignedTrip()
        this.getCreateRideList()
        // this.storeNotification()
      })
    
      this.socket.on("cronWork",(data:any)=>{
        if(data.data=="toBooked"){
          this.getCreateRideList()
          var driverName=''
          this.loginApi.showNotification(driverName)
        // this.getCreateRideList()
        }
      })
      this.socket.on('pending', (data: any) => {
      })
  }
 
  onChangeLimit(){
    this.pageNo=1
    this.getCreateRideList()
  }
  dateRange() {
    const from: any = document.getElementById('fromDate')
    const to: any = document.getElementById('toDate')
    console.log('fromDate:', from.value, 'toDate:', to.value);
    var fromDate = from.value
    var toDate = to.value
    const datefrom = new Date(fromDate)
    const dateto = new Date(toDate)
    var data = {
      from: datefrom.toLocaleDateString(),
      to: dateto.toLocaleDateString()
    }
    this.createRideApi.showCreateRide(data).subscribe((data: any) => {
      this.createRideDataList=data
    })
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
      this.getCreateRideList()
    }else{
      return
    }
    // var date={from:this.fromDt,to:this.toDt}
    // this.createRideApi.showCreateRide(date).subscribe((data:any)=>{
    //    this.createRideDataList =data
    // })
  }
  getCreateRideList(pg?:any) {
    // this.fromDt=''
    // this.toDt=''
    if (pg) {
      if (pg == this.pageNo) {
        return
      }
      this.pageNo = pg
    }
  var data:any={
      query:this.searchField,
      pageno:Number(this.pageNo),
      pagelimit:Number(this.pageLimit),
      }
      if(this.fromDt!='' && this.toDt!=''){
        data.to=this.toDt
        data.from=this.fromDt
      }
    this.createRideApi.showCreateRide(data).subscribe({
      next: (data: any) => {
        // var checkStatus=data[1].currentStatus
        // if(checkStatus=='pending' || checkStatus=='booked'){
        //   this.showBtn=true
        // }else{
        //   this.showBtn=false
        // }
        this.loaderApi.hide()
          this.fromDt=''
          this.toDt=''
          this.createRideDataList = data.data
          this.countPages(data.count)
      }, error: (err: any) => {
        console.log(err)
      }
    })
   this.findReassignedTrip()
  }
findReassignedTrip(){
  this.createRideApi.findReassignedRide().subscribe((data:any) => {
    this.notificationCounter=data.length
    this.notificationList=data
    // this.storeNotification(this.notificationList)
  })
}
bellIcon(){
  console.log('bell icon clicked');
  this.closeNotify=true
}
closeNotification(){
  this.closeNotify=false
}
// storeNotification(data:any){
//   var notificationDatas:any =data.map((obj:any)=>{
//     return {
//       objId:obj._id,
//       userId:obj.userId,
//       driverId:obj.driverId
//     }
//   })
//   this.confirmRideApi.storeNotification(notificationDatas).subscribe((data:any)=>{
//     console.log(data);
//   })
//   console.log(notificationDatas);
// }
  countPages(page:any){
    this.pageList=[]
    var pages=page/this.pageLimit
    if(page%this.pageLimit){
      pages++
    }
    for(var i=1; i<=pages; i++){
      this.pageList.push(i)
    }
  }
  hideDetails() {
    this.isRequestInfo = false
    this.isDialogBox = false
    this.showTable = true
    this.driver = undefined
  }
  assingnToSelectedDriver() {
    var data = {
      tripId: this.tripId,
      driverId: this.driverId,
      currentStatus: 'pending',
      assignType:'selected'
    }
    // console.log(data)
    console.log('assigning to selected driver')
    this.loaderApi.show()
    this.createRideApi.setDriverForTrip(data).subscribe((response: any) => {
      this.loaderApi.hide()
      if(response.success){
        this.loginApi.showMessage({message:response.message,bool:response.success})
      this.hideNearestDriverBtn = true
      this.cancelBtn=false
        this.isDialogBox = false
        this.isRequestInfo = false
        this.driver=''
        // console.log(this.rideStatus)
        this.getCreateRideList()
        this.findReassignedTrip()
        // console.log(response)
      }else{
        this.loginApi.showMessage({message:response.message,bool:response.success})
      }
    })
  }
  assignToNearestDriver(){  
    if(this.driverList.length==0){
      this.loginApi.showMessage({message:'no driver available',color:'orange'});

      return
    }
    var data={
      assignType:'auto',
      tripId:this.tripId,
      driverId:this.driverList[0]._id,
      currentStatus:'pending',
    }
    // console.log(this.driverList);
    this.loaderApi.show()
    this.createRideApi.setDriverForTrip(data).subscribe((driver: any) => {
      this.loaderApi.hide()
      // console.log(driver);
      if(driver.success){
        this.loginApi.showMessage({message:driver.message,bool:driver.success});
        this.isDialogBox = false
        this.isRequestInfo = false
        this.getCreateRideList()
        this.findReassignedTrip()
      }else{
        this.loginApi.showMessage({message:driver.message,bool:driver.success});
      }

    })
  }
  selectRequest(request: any) {
    this.isRequestInfo = true
    this.allAddresses.pop(this.allAddresses.length)
    this.filterRequest = request
    // console.log(this.filterRequest)
  }
  selectedDriver(data: any) {
    // selectedDriver
    var selectedDriver:any=document.getElementById('selectedDriver')
    // selectedDriver.style.border='1px solid red'
    // // if (data){
    // // selectedDriver.style.color = 'black'
    // // }
    // selectedDriver.style.color = 'blue'
    this.hideNearestDriverBtn = false
    this.cancelBtn = true
    this.driver = data
    // console.log(this.driver)
    this.driverId = data._id
    console.log(this.driverId)
  }

  cancelRide(response: any) {
    var data = {
      id: response._id,
      currentStatus: 'cancelled',
      cancelledBy: 'Admin cancel'
    }
    this.loaderApi.show()
    this.createRideApi.cancelRequest(data).subscribe((response: any) => {
      this.loaderApi.hide()
      if(response.success){
        this.loginApi.showMessage({message:response.message,bool:response.success})
        this.getCreateRideList()
        // console.log(response)
      }else{
        this.loginApi.showMessage({message:response.message,bool:response.success})
      }
    })
  }
  cancelDriver() {
    this.driver = undefined
    this.cancelBtn = false
    this.hideNearestDriverBtn = true
  }
  showDialogBox(data: any) {
    this.tripId = data._id
    this.filterRequest = data
    this.isRequestInfo = true
    this.isDialogBox = true
    this.DriverApi.findDriverForTrip(data).subscribe({
      next: (data: any) => {
        this.driverList = data
      }, error: (err) => {
        console.log(err)
      }
    })
  }
}
