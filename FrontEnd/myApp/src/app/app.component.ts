import {io} from 'socket.io-client'
import { Component, OnInit, ViewChild } from '@angular/core';  
import { Validators, FormBuilder, FormControl, FormGroup  } from '@angular/forms';  
import { LoginApiService } from './services/login-api.service';
import {UserapiService} from './services/userapi.service'
import {Router} from '@angular/router'
import {SessionService} from './services/session.service'
import { SocketService } from './services/socket.service';
import { LoaderService } from './services/loader.service';
// import { Router } from 'express';
@Component({  
  selector: 'app-root',  
  templateUrl: './app.component.html',  
  styleUrls : ['./app.component.css']  
})  
export class AppComponent  {  
  isLogin :Boolean=false; 
  userName:any=''
  difference:any
  adminDataList:any
  admin:any
  adminRegisterForm:boolean=false
  adminLoginForm:boolean=true
  isUserName:boolean=false
  notUserName:boolean=false
  isPassword:boolean=false
  notPassword:boolean=false
  credentials:any
  password:any
  adminName:any=''
  adminPassword:any=''
  pass:any=''
  sessionData:any
  interval:any
  socket:any

    constructor(private builder: FormBuilder, private loginApiService: LoginApiService,private router:Router,private userApi: UserapiService,private sessionService: SessionService,private socketService: SocketService,private loaderApi:LoaderService) {  
  }  
  ngOnInit(): void {
  this.validateSession()
  this.createSocket()
  }  

    logOut(bool:boolean) {
      console.log('herein lg');
      
      this.loginApiService.showMessage({message:'logged out'})
      this.isLogin=bool
      this.sessionService.clearSession()
    }
    createSocket(){
      if(!this.socket){
        this.socket=io('http://localhost:3000')
        if(this.socket){
          this.socket.on('connect',()=>{
            console.log('socket connected')
            this.socketService.setSocket(this.socket)
          })
        }
      }
    }
    storeAdmin(){
      var credentials = {
        adminName:this.adminName,
        adminPassword:this.adminPassword
      }
      this.loginApiService.storeAdmin(credentials).subscribe(
        (data:any)=>{
          if(data.success){
            this.registerAdmin(true)
            this.loginApiService.showMessage({message:data.message,bool:true})
          }else{
            var string='something went wrong'
            if(data.message=='duplicate')
            {
              string='already Exist'
            }
            this.loginApiService.showMessage({message:string,})
          }
        }
    )}
    registerAdmin(bool:any){
      this.adminLoginForm=bool
      this.adminRegisterForm=!bool
    }
    findAdmin(){
    if(this.userName!='' && this.pass!=''){
        this.isUserName=false
        this.isPassword=false
        this.notUserName=false
        this.notPassword=false
          this.credentials={
            adminName:this.userName,
            adminPassword:this.pass,
            }
      this.loaderApi.show()
          this.loginApiService.findAdmin(this.credentials).subscribe({next:(data:any)=>{
            this.loaderApi.hide()
            if(data.success){
              this.userName=''
              this.pass=''
              this.router.navigate(['/createRide']);
              this.isLogin=true
              this.setSession()
              this.validateSession()
            }else{
              this.loginApiService.showMessage({message:'Wrong Credentials',bool:false})
              this.notUserName=true
              this.notPassword=true
            }
          },error:(err)=>{
            console.log(err)
          }})
        }
      else{
        if(this.userName==''){this.isUserName=true}else{this.isUserName=false}
        if(this.pass==''){
          this.isPassword=true
      }else{
          this.isPassword=false
      }
    }
      } 
      setSession(){
        this.sessionService.storeSession()
      }
      createInterval(){
        this.interval=setInterval(()=>this.validateSession(),this.difference)
      }
      validateSession(){
        var data:any=this.sessionService.validateSession()   
        this.isLogin=data.success
        if(this.isLogin){
          this.difference=data.expiry
          if(this.interval){
            
            clearInterval(this.interval)
            
            this.createInterval()
          }
          else{
            this.createInterval()
          }
        }
        else{
          if(this.interval){
            clearInterval(this.interval)
          }
        }
      }
    onMouseMove(){
      var data = this.sessionService.getSession()      
      if(data)
    this.sessionService.storeSession()
      }
    onkeypress(){
      var data = this.sessionService.getSession()
      if(data)
    this.sessionService.storeSession()
      }
}  