import { Component,OnInit } from '@angular/core';
import {CountryApiService} from '../services/country-api.service'
import {UserapiService} from '../services/userapi.service'
import {CardApiService} from '../services/card-api.service'
import {SessionService} from '../services/session.service'
import { LoginApiService } from '../services/login-api.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  // myForm:FormGroup;
  countryList:any=[]
  file:any
  cardNumber:any
  isName:boolean=false
  isEmail:boolean=false
  isNumber:boolean=false
  isImageEmpty:boolean=false
  isCountry:boolean=false
  cvv:any
  expiry:any
  cuName:any
  filteredCountry:any
  cuEmail:any
  cuPhone:any
  zip:any
  validCardNumber:any
  cardForm:boolean=false
  billAddress:any
  userId:any=''
  userName:any=''
  timePicker:any
  userData:any=''
  selectedCountry:any
  storeButton:boolean=true
  editButton:boolean=false
  mongoUserData:any=[]
  errors:any=[]
  userList:any=[]
  userEmail:any=''
  pageLimit:any=6
  cardList:any=[]
  filterUserCard:any=[]
  pageNo:any=1
  pageCount:any
  cardData:any=[]
  pageList:any=[]
  userMobile:any=''
  isValid:boolean=false
  userDataCard:any=[]
  selectedData:any
  countryId:any=''
  countryCode:any=''
  countryName:any=''
  constructor(private countryApi:CountryApiService,private userApi:UserapiService,private cardApi:CardApiService,private sessionApi:SessionService,private loginApi:LoginApiService,private loaderApi:LoaderService){
  
  }
  ngOnInit():void{
    this.loaderApi.show()
    this.getUserData()
    this.getCardData()
    this.getCountries()
    // this.getCardList()
  }
  getCountries() {
    this.countryApi.showAllCountryData().subscribe((data: any) => {
      this.loaderApi.hide()
      this.countryList = data
    })
  }
  
  onSelectCountry(){
    this.filteredCountry = this.countryList.filter((obj:any)=>obj._id === this.selectedCountry._id)
    this.countryName=this.filteredCountry[0].countryName
    this.countryId=this.filteredCountry[0]._id
    this.countryCode= this.filteredCountry[0].countryCode
  }
  onSelectFile(event:any){
    this.file= event.target.files[0];
    if(this.file.type.startsWith("image/")){
      this.isImageEmpty=false
    }else{
      this.isImageEmpty=true
      this.file=undefined
      this.loginApi.showMessage({message:'only image are allowed',color:'black'})
    }
}
notEmpty(fld:any){
  console.log(fld);
  switch(fld){
    case 'image':{
      if(this.file!=undefined){
        this.isImageEmpty=false
        break;
      }
      else{
        this.isImageEmpty=true
        break;
      }
    }
    case 'name':{
      if(this.userName!=''){
        this.isName=false
        break;
      }
      else{
        this.isName=true
        break;
      }
    }
    case 'email':{
      if(this.userEmail!=''){
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var test=regex.test(this.userEmail);
        console.log(test)
        if(test){
          this.isEmail=false
        }else{
          this.isEmail=true
        }
        break;
      }else{
        this.isEmail=true
        break;
      }
    }
    case 'country':{
      if(this.selectedCountry!=''){
        this.isCountry=false
        break;
      }else{
        this.isCountry=true
        break;
      }
    }
    case 'mobile':{
      if(this.userMobile!=''){
        this.isNumber=false
        break
      }else{
        this.isNumber=true
        break;
      }
    }
  }  
}

// getCardList(){
//   this.cardApi.getCard().subscribe({next:(data:any) =>{
//     this.cardList=data
//     console.log(this.cardList)
//   },error:(err)=>{
//     console.log(err)
//   }})
// }

resetMessage(){
  this.isName=false
  this.isEmail=false
  this.isNumber=false
  this.isCountry=false
  this.isImageEmpty=false
}
// validation(){
//   var name=document.getElementById('name')
//   var email=document.getElementById('email')
//   var phone=document.getElementById('phone')
//   var image=document.getElementById('file-input')
//   var country=document.getElementById('country')
//   var mobile=document.getElementById('mobile')
  
//   var uname=name.value  
  
// }

  storeUserData(){
    if(this.userName!='' && this.userEmail!='' && this.userMobile !='' && this.countryCode!=''){
      this.loaderApi.show()
      this.resetMessage()
    var data=new FormData()
    data.append('image',this.file)
    data.append('name',this.userName)
    data.append('email',this.userEmail)
    data.append('mobile',this.userMobile)
    data.append('country',this.countryId)
    console.log(data)
    this.userApi.storeUser(data).subscribe((userData:any)=>{
      this.loaderApi.hide()
      console.log(userData)
      if(userData.success){

        this.loginApi.showMessage({message:'user stored successfully',bool:true})
        this.getUserData()
        this.resetForm()
      }else{
        var string='something went wrong'
        if(userData.message=='duplicate'){
          string='already exists'
        }
        this.loginApi.showMessage({message:string})
      }
      })
  }else{
    if(this.file==undefined){this.isImageEmpty=true}else{this.isImageEmpty=false}
    if(this.userName==''){this.isName=true}else{this.isName=false}
    if(this.userEmail==''){this.isEmail=true}else{this.isEmail=false}
    if(this.userMobile==''){this.isNumber=true}else{this.isNumber=false}
    if(this.countryCode==''){this.isCountry=true}else{this.isCountry=false}
  }
}
validateNum(e:any,ln:any,id:any){
  if(e.target.value.length==ln){
    var elm:any=document.getElementById(id)
    elm.focus()
  }
}

  timeEvent(event:any){
    var timeEvent =event.target.value
    console.log(timeEvent)
    } 
  storeCardData(){
    this.timePicker = document.getElementById('timePicker');
 this.timePicker.addEventListener('input',this.timeEvent=(event:any)=>{
  console.log(event)
 }) 
  var selectedTime = this.timePicker.value;
  const dataobj=new Date(selectedTime)
  const date=dataobj.toLocaleDateString()
  const expiry=date.split('/')
  console.log(expiry);
   var card={
    cardNumber:this.cardNumber,
    cvv:this.cvv,
    expmonth:expiry[1],
    expyear:expiry[2],
   }
   this.cardData=[card,this.userDataCard]
   console.log(card)
   console.log(this.cardData)
   this.loaderApi.show()
   this.cardApi.storeCard(this.cardData).subscribe((data:any) => {
    this.loaderApi.hide()
    console.log(data);
    if(data.success){
      this.loginApi.showMessage({message:'card stored successfully',bool:true})
      this.getCardData()
      console.log(data)
      this.cardForm=false
      this.resetForm()
    }else{
      this.loginApi.showMessage({message:data.message})
    }
   })
  }  
  cancelAddCard(){
    this.resetForm()
    this.cardForm=false
  }
  addCard(data:any){
    console.log(data.userStripeId);
    this.userDataCard=data
    this.cardForm=true
    console.log(this.cardList)
  
    var filterCard=this.cardList.filter((obj:any)=>obj.userId==data.userStripeId)
    console.log('userCard',filterCard)
    this.filterUserCard=filterCard
  }
  onEditButton(data:any){
    this.storeButton=false
    this.selectedData=data
    console.log(this.selectedData)
    this.userName=this.selectedData.userName
    this.userEmail=this.selectedData.userEmail
    this.userMobile=this.selectedData.userPhone
    var filterCountry=this.countryList.filter((item:any)=>
      item._id.toString()==this.selectedData.countryId._id.toString()
    )
    console.log(filterCountry);
    this.selectedCountry=filterCountry[0].countryName
    this.countryCode= filterCountry[0].countryCode
    this.editButton=true
  }
  onDeleteButton(data:any){
    this.selectedData=data
    this.userId=this.selectedData._id
    var decision=confirm('Are you sure you want to delete user')
    if(decision==true){
      this.loaderApi.show()
      this.userApi.deleteUser({_id:this.userId}).subscribe((data:any)=>{
        this.loaderApi.hide()
        console.log(data);
        if(data.success){

          this.loginApi.showMessage({message:'user deleted successfully',bool:true})
          this.getUserData()
          console.log(data)
          this.resetForm()
        }else{
          this.loginApi.showMessage({message:data.message,})
        }
        })
      }else{
        this.resetForm()
      }
  }
  updateUserData(){
    var data=new FormData()
    if(this.userName!=this.selectedData.userName)
    data.append('name',this.userName)
    if(this.userEmail!=this.selectedData.userEmail) 
    data.append('email',this.userEmail)
    if(this.userMobile!=this.selectedData.userPhone)
    data.append('mobile',this.userMobile)
    if(this.countryId!=this.selectedData.countryId._id && this.countryId!='')
    data.append('country',this.countryId)
    
    if(this.file){
      data.append('image',this.file)
    }
    data.append('_id',this.selectedData._id)
    console.log(data)
    this.loaderApi.show()
    this.userApi.updateUser(data).subscribe((data:any)=>{
      console.log(data)
      if(data.success){
        this.loginApi.showMessage({message:'user updated successfully',bool:data.success})
      }else{
        this.loginApi.showMessage({message:data.message,bool:data.success})
      }
    this.getUserData()
      console.log(data)
      this.editButton=true
      this.resetForm()
      this.editButton=false
      this.storeButton=true
    })
    this.getUserData()
  }

  resetForm(){
    this.userName=''
    this.selectedCountry=''
    this.userEmail=''
    this.userMobile=''
    this.countryCode=''
    this.file=undefined
    this.cardNumber=''
    this.cvv=''
    this.expiry=''
    this.editButton=false
    this.storeButton=true
    this.resetMessage()
    this.loaderApi.hide()
  }
  getUserData(pg?:any){
    if(pg){
      if(pg==this.pageNo){
        return 
      }
      this.pageNo=pg
    }
    var data:any={
      pagelimit:this.pageLimit,
      pageno:this.pageNo
    }
    console.log(data)
    this.userApi.getUser(data).subscribe({next:(userData:any)=>{
      console.log(this.userList)
      this.mongoUserData=userData[0]
      this.pageCount=userData[1]
      this.countPages(this.pageCount)
      this.loaderApi.hide()
    } })
  }
  getCardData(){
    this.cardApi.getCard().subscribe((data:any) => {
      console.log(data)
      console.log(this.mongoUserData)
      this.cardList=data.response
      if(data.success){
        this.loginApi.showMessage({message:data.message,bool:data.success})
      }else{
        this.loginApi.showMessage({message:data.message,bool:data.success})
      }
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
onChangeLimit(){
    this.pageNo=1
    this.getUserData()
  }
}
