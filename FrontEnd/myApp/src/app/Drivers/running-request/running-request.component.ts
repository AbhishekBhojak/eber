import { Component, OnInit } from '@angular/core';
import { CreateRideApiService } from 'src/app/services/create-ride-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { LoginApiService } from 'src/app/services/login-api.service';
import { SessionService } from 'src/app/services/session.service';
import { SettingApiService } from 'src/app/services/setting-api.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-running-request',
  templateUrl: './running-request.component.html',
  styleUrls: ['./running-request.component.css']
})
export class RunningRequestComponent {
  requestList: any = []
  selectedRequest: any = {}
  Timmer: any = ''
  counter: any
  socket: any
  showInfo: boolean = false
  btnValue: any = 'Accept'
  interval:any
  serverStartTime:any
  constructor(private sessionApi: SessionService, private createRideApi: CreateRideApiService, private settingApi: SettingApiService, private socketService: SocketService,private loginApi:LoginApiService,private loaderApi:LoaderService) { }
  ngOnInit() {
    this.sessionApi.storeSession()
    // this.notification()
    this.loaderApi.show()
    this.getTimmer()
    this.findRequestedTrip()
    setTimeout(() => {
      this.socket = this.socketService.getSocket()
      this.socket.on('cronWork', (data: any) => {
        console.log(data);
        if(data.data=='toBooked'){
          this.loginApi.showMessage({message:'Ride Request Iterated',color:'orange'})
        }
        this.findRequestedTrip()
      })
    }, 500);
  }
  getTimmer() {
    this.settingApi.getServiceData().subscribe((data: any) => {
      this.Timmer = data.time
      this.serverStartTime= new Date(data.serverStartTime).getSeconds()
      
      // this.startCountdown(this.Timmer)
    })
  }
  // startCountdown(durationInSeconds:any) {
  //   let remainingTime = durationInSeconds;

  //   // Update the countdown timer every second
  //   const interval = setInterval(() => {
  //     // Calculate remaining hours, minutes, and seconds
  //     const hours = Math.floor(remainingTime / 3600);
  //     const minutes = Math.floor((remainingTime % 3600) / 60);
  //     const seconds = remainingTime % 60;

  //     // Format the countdown timer display
  //     const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  //     // Update the display
  //     // this.counter=document.getElementById('timmer').innerText = formattedTime;
  //     this.counter=document.getElementById('timmer')
  //     this.counter.innerText = formattedTime

  //     // Decrement remaining time
  //     remainingTime--;

  //     // Stop the countdown when it reaches zero
  //     if (remainingTime < 0) {
  //       clearInterval(interval);
  //       // Optionally, you can add a callback function here to handle actions after the countdown ends.
  //       // For example, displaying a message or triggering another function.
  //       // alert("Countdown timer has ended!");
  //     }
  //   }, 1000);
  // }
  findRequestedTrip() {
    this.createRideApi.findRequestedTrip().subscribe((response: any) => {
      this.loaderApi.hide()
      this.requestList = response
      // console.log(this.requestList);
      this.requestList.forEach((ride: any, index: any) => {
        if (ride.currentStatus == "pending") {
          var rt = new Date(ride.updatedAt).getTime()
          var nt = new Date().getTime();
          var diff = +((+this.Timmer + (rt - nt) / 1000).toFixed(0));
          this.requestList[index].timer = diff
        }
      }
      )
      this.countDown()
    })
  }
  countDown() {
    if(this.interval){
      clearInterval(this.interval)
    }
    this.interval = setInterval(() => {
      this.requestList.forEach((ride: any, index: any) => {
        if (ride.currentStatus == "pending") {
          if (ride.timer <= 0 && ride.assignType=="selected") {
            this.requestList=this.requestList.filter((rd:any)=>rd._id.toString()!=ride._id.toString())
            this.socket.emit('timeOver', ride)
            clearInterval(this.interval)
            this.findRequestedTrip()
            return
          }
         else if(ride.timer<=0 && ride.assignType=='auto' ){
          
            var nt=new Date().getSeconds()
            // var sst=this.serverStartTime
            this.requestList=this.requestList.filter((rd:any)=>rd._id.toString()!=ride._id.toString())
            // if(nt!= 30 && nt !=0 ){
                // setTimeout(() => {
                  // this.socket.emit('timeOvercron', ride)
                // }, 500);
            return
            // }
          //   else if(sst<30 && nt!=sst && nt%30!=sst){
          //     this.socket.emit('timeOvercron', ride)
          //     clearInterval(this.interval)
          //     this.findRequestedTrip()
          // }
        }
        if(this.requestList[index]){
          this.requestList[index].timer = ride.timer - 1
        }
      }
      })
    }, 1000);
  }
  // notification(){
  //   var notification = new Notification()
  // }
  acceptRequest(response: any) {
    let btnValue: any
    let statusValue: any
    var data = {
      id: response._id,
      driverId: response.driverId._id,
      currentStatus: response.currentStatus
    }
    this.loaderApi.show()
    this.createRideApi.acceptRequest(data).subscribe((response:any) => {
      this.loaderApi.hide()
      if(response.success){
        this.loginApi.showMessage({message:response.message,bool:response.success})
        this.findRequestedTrip()
        this.btnValue = btnValue
      }else{
        this.loginApi.showMessage({message:response.message})
      }
    })
  }
  cancelRequest(response: any) {
    var data = {
      id: response._id,
      driverId: response.driverId._id,
      currentStatus: 'cancelled',
      cancelledBy: 'Driver cancel',
      assignType:response.assignType,
      data:response
    }
    this.loaderApi.show()
    this.createRideApi.cancelRequest(data).subscribe((response:any) => {
      this.loaderApi.hide()
      if(response.success){
          // this.socket.emit('timeOvercron', response.data)
          this.loginApi.showMessage({message:response.message,bool:response.success})
        this.findRequestedTrip()
      }else{
        this.loginApi.showMessage({message:response.message,})
      }
      })
  }
  hideDetails() {
    this.showInfo = false
  }
  showDetails(data: any) {
    {
      this.showInfo = true
      this.selectedRequest = data
    }
  }
}
