import { Component } from '@angular/core';
import { UserapiService } from '../../services/userapi.service'
import { CountryApiService } from '../../services/country-api.service'
import { VehiclePriceApiService } from '../../services/vehicle-price-api.service'
import { CreateRideApiService } from '../../services/create-ride-api.service'
import { CardApiService } from '../../services/card-api.service'
import { SettingApiService } from '../../services/setting-api.service'
import { SessionService } from '../../services/session.service'
import { LoginApiService } from 'src/app/services/login-api.service';
import { LoaderService } from 'src/app/services/loader.service';
declare let google: any
@Component({
  selector: 'app-create-ride',
  templateUrl: './create-ride.component.html',
  styleUrls: ['./create-ride.component.css']
})
export class CreateRideComponent {
  searchUser: any = ''
  map: any
  isName: boolean = false
  isEmail: boolean = false
  isNumber: boolean = false
  isImageEmpty: boolean = false
  isCountry: boolean = false
  showDetails: boolean = true
  showForm: boolean = false
  showDestInfo: boolean = false
  showInfo: boolean = true
  showDestination: boolean = true
  userData: any = []
  autocompleteFrom: any = ''
  from: any = ''
  to: any = ''
  showRideInfo: boolean = false
  selectedVehiclePrice: any
  distance: any = ''
  duration: any = ''
  pickup: any
  drop: any
  stopField: boolean = true
  directionsService: any
  directionsRenderer: any
  autocompleteTo: any = ''
  userDestination: any
  addButton: boolean = false
  time: any
  date: any
  expiry: any = ''
  cvv: any = ''
  isUserCard: boolean = false
  cardForm: boolean = false
  enableField: boolean = true
  userName: any = ''
  file: any
  showService: boolean = false
  selectedCountry: any
  getStop: any
  isBookRide: boolean = true
  countryList: any = []
  userEmail: any = ''
  userPhone: any = ''
  userId: any = ''
  countryName: any;
  countryId: any;
  minDate: any = ''
  stopLimitData: any
  countryCode: any;
  stopValue: any = '';
  cardTimePicker: any;
  wayPoints: any = []
  isCardNumber: boolean = false
  isCvv: boolean = false
  isExpiry: boolean = false
  isAddCard: boolean = true
  waypointsList: boolean = true
  filteredUserCardList: any = []
  stopAutoComplete: any = '';
  request: any;
  cardList: any
  istime: boolean = false
  timePicker: any;
  paymentType: any = ''
  showTimePicker = false
  showPayOption: boolean = true
  cardNumber: any = '';
  notUser: boolean = false
  addStopBtn: boolean = true
  createRideDataList: any = []
  cardId: any;
  selectPaymentType: any
  stopLocation: any;
  vehiclePriceList: any = []
  vehiclePriceId: any = '';
  createRideData: any = {};
  showUserForm: boolean = true
  unitDistancePrice: any;
  unitTimePrice: any;
  basePrice: any;
  basePriceDistance: any;
  minFare: any;
  setTime: any = ''
  totalAmount: any;
  dist: any;
  durat: any
  vehicleService: any;
  serviceCost: any;
  filterUserCard:any
  ScheduleDate: any = '';
  ScheduleTime: any = '';
  constructor(private userApi: UserapiService, private countryApi: CountryApiService, private vehiclePriceApi: VehiclePriceApiService, private createRideApi: CreateRideApiService,
    private cardApiService: CardApiService, private settingApi: SettingApiService, private sessionApi: SessionService, private loginservice: LoginApiService, private loaderApi: LoaderService,private cardApi:CardApiService) { }
  ngOnInit() {
    // this.loginservice.showMessage({message:'is login',bool:true});
    this.loaderApi.show()
    this.minDate = new Date().toISOString().slice(0, 16)
    this.getVehicles()
    this.getCardDataList()
    this.getStopLimit()
    // this.getCreateRideData()
    setTimeout(() => {
      this.loadMap()
    }, 1000)
    this.getCountries()
  }
  notEmpty(fld: any) {
    switch (fld) {
      case 'image': {
        if (this.file != undefined) {
          this.isImageEmpty = false
          break;
        }
        else {
          this.isImageEmpty = true
          break;
        }
      }
      case 'name': {
        if (this.userName != '') {
          this.isName = false
          break;
        }
        else {
          this.isName = true
          break;
        }
      }
      case 'email': {
        if (this.userEmail != '') {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          var test = regex.test(this.userEmail);
          console.log(test)
          if (test) {
            this.isEmail = false
          } else {
            this.isEmail = true
          }
          break;
        } else {
          this.isEmail = true
          break;
        }
      }
      case 'country': {
        if (this.selectedCountry != '') {
          this.isCountry = false
          break;
        }
        else {
          this.isCountry = true
          break;
        }
      }
      case 'phone': {
        if (this.userPhone != '') {
          this.isNumber = false
          break;
        }
        else {
          this.isNumber = true
          break;
        }
      }
      case 'cardNo': {
        if (this.cardNumber != '') {
          this.isCardNumber = false
          break;
        }
        else {
          this.isCardNumber = true
          break;
        }
      }
      case 'cvvNo': {
        if (this.cvv != '') {
          this.isCvv = false
          break;
        }
        else {
          this.isCvv = true
          break;
        }
      }
      case 'expiry': {
        if (this.expiry != '') {
          this.isExpiry = false
          break;
        }
        else {
          this.isExpiry = true
          break;
        }
      }
    }
  }
  findUser() {
    this.loaderApi.show()
    this.userApi.getUserNumber({ userPhone: this.searchUser }).subscribe((data: any) => {
      this.loaderApi.hide()
      this.userData = data
      console.log(this.userData);
      if (this.userData.length != 0) {
        this.showRideInfo = true;
        this.userName = this.userData[0].userName
        this.userEmail = this.userData[0].userEmail
        this.userPhone = this.userData[0].userPhone
        this.userId = this.userData[0]._id
        this.showDestination = true
        this.waypointsList = true
        // this.isUserCard=true
        setTimeout(() => {
          this.showInfo = false
          this.showDestInfo = true
        }, 300)
        setTimeout(() => {
          this.loadAutocompleteService()
        }, 2500);
        this.checkUserCardExists()
        this.notUser = false
      } else {
        this.loginservice.showMessage({ message: 'User Not Found' })
        this.notUser = true
        // if(decide==true){
        //   this.addButton=true
        //   this.showDetails=false
        //   this.showDestInfo=false
        //   this.showForm=true
        //   this.searchUser=''
        //   this.resetForm()
        // }else{
        //   this.searchUser=''
        //   this.showDestInfo=false
        //   this.showDetails=true
        //   this.resetForm()
        // }
      }
    })
  }
  addUser() {
    this.addButton = true
    this.showDetails = false
    this.showDestInfo = false
    this.showForm = true
    this.searchUser = ''
    this.resetForm()
  }
  getStopLimit() {
    this.settingApi.getServiceData().subscribe((data: any) => {
      this.stopLimitData = Number(data.stops)
    })
  }
  cancelAddCard() {
    this.cardForm = false
    this.showDestInfo = true
    this.showUserForm = true
    this.showDetails = true
  }
  checkUserCardExists() {
    var filteredUserCards = this.cardList.filter((obj: any) => obj.userId === this.userData[0].userStripeId)
    console.log(filteredUserCards)
    if (filteredUserCards.length != 0) {
      this.filteredUserCardList = filteredUserCards
      // }else{
      //   this.isUserCard=false
      //   alert('user card not found')
    }
  }
  addCard() {
    this.cardForm = true
    this.showDestInfo = false
    this.showDetails = false
    this.showUserForm = true
  }
  cancelAddUser() {
    this.showForm = false
    this.resetForm()
    this.resetMessage()
    this.showDetails = true
    this.showDestInfo = false
  }
  // getTime(){
  //   this.timePicker = document.getElementById('timePicker');
  //   const today = new Date().toISOString().split('T')[0];
  //   this.timePicker.min= today
  //   this.timePicker.addEventListener('input',this.timeEvent) 
  //   var selectedTime = this.timePicker.value;
  //   console.log(selectedTime);
  //   const dataobj=new Date(selectedTime)
  //   console.log(dataobj)
  //   const date=dataobj.toLocaleDateString()
  //   const time=dataobj.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
  //   this.time=time
  //   this.date=date
  //   this.showTimePicker=false
  // }
  timeEvent(event: any) {
    var timeEvent = event.target.value
    console.log(timeEvent)
  }
  getCountries() {
    this.countryApi.showAllCountryData().subscribe((data: any) => {
      this.countryList = data
    })
  }
  paymentOption() {
    if (this.filteredUserCardList) {
      console.log(this.filteredUserCardList)
      this.cardId = this.selectPaymentType._id
      console.log(this.cardId)
      // console.log(this.selectPaymentType);
    } else{
      prompt('enter amount for payment')
    }
  }
  cardTimeEvent(event: any) {
    var timeEvent = event.target.value
    console.log(timeEvent)
  }
  storeCardData() {
    this.cardTimePicker = document.getElementById('cardtimePicker');
    this.cardTimePicker.addEventListener('input', this.cardTimeEvent = (event: any) => {
    })
    var selectedTime = this.cardTimePicker.value;
    console.log(selectedTime)
    if (this.cardNumber != ''
      && this.cvv != '' && this.expiry != '') {

      const dataobj = new Date(selectedTime)
      const date = dataobj.toLocaleDateString()
      const expiry=date.split('/')
      console.log(expiry);
      var cardData = {
        cardNumber: this.cardNumber,
        cvv: this.cvv,
        expmonth:expiry[1],
        expyear:expiry[2]
      }
      var userData={
        userStripeId:this.userData[0].userStripeId,
        _id:this.userData[0]._id,
        userName:this.userData[0].userName,
        userEmail:this.userData[0].userEmail
      }
      var cardDatas=[cardData,userData]
      console.log(cardDatas)
      this.loaderApi.show()
      this.cardApiService.storeCard(cardDatas).subscribe((data: any) => {
        this.loaderApi.hide()
          if(data.success){

        this.loginservice.showMessage({ message: data.message, bool: true })
        this.getCardDataList()
        this.checkUserCardExists()
        console.log(data)
        this.showDestInfo = true
        this.showUserForm = true
        this.showDetails = true
        this.cardForm = false
        this.isUserCard = true
        this.cardNumber = ''
        this.cardTimePicker.value = ''
        this.cvv = ''

        this.resetForm()
          }else{
            this.loginservice.showMessage({message:data.message})
          }
      })
    }
    else {
      if (this.cardNumber == '') { this.isCardNumber = true } else { this.isCardNumber = false }
      if (this.cvv == '') { this.isCvv = true } else { this.isCvv = false }
      if (this.expiry == '') { this.isExpiry = true } else { this.isExpiry = false }
    }
  }
  getVehicles() {
    this.vehiclePriceApi.getVehiclePrice().subscribe((data: any) => {
      this.vehiclePriceList = data
    })
  }
  async getDetails() {
    var request
    var filteredStopValues = [this.from.value]
    this.wayPoints.map((obj: any) => {
      filteredStopValues.push(obj.location)
    })
    filteredStopValues.push(this.to.value)
    this.userDestination = filteredStopValues.slice()
    this.pickup = this.userDestination.shift()
    this.drop = this.userDestination.pop()
    var service = new google.maps.DistanceMatrixService();
    if (this.stopValue.value) {
      var origin, destination
      this.dist = 0
      this.durat = 0
      for (let i = 0; i < filteredStopValues.length - 1; i++) {
        origin = filteredStopValues[i]
        destination = filteredStopValues[i + 1]
        console.log("origin: " + origin, "destination: " + destination);

        request = {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        }
        await service.getDistanceMatrix(request,
          (response: any, status: any) => {
            // response.push(filteredStopValues)
            var DistTemp = 0
            var timeTemp = 0
            var avegDistance
            this.distance = response.rows[0].elements[0].distance.text;
            DistTemp = +this.distance.split(' ')[0]
            this.dist = DistTemp + this.dist
            avegDistance = Math.round(this.dist * 100) / 100;
            this.duration = response.rows[0].elements[0].duration.text;
            timeTemp = +this.duration.split(' ')[0]
            this.durat = timeTemp + this.durat
            this.distance = avegDistance.toString() + ' km'
            this.duration = this.durat.toString() + ' mins'
          }
        );
      }
    }
    else {
      request = {
        origins: [this.from.value],
        destinations: [this.to.value],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }
      await service.getDistanceMatrix(request,
        (response: any, status: any) => {
          // response.push(filteredStopValues)
          var temp
          // console.log(response)
          this.distance = response.rows[0].elements[0].distance.text;
          // this.dist+=+this.distance.split(' ')[0]
          this.dist = +this.distance.split(' ')[0]

          this.duration = response.rows[0].elements[0].duration.text;
          this.durat = +this.duration.split(' ')[0]
        }
      );
    }
    this.vehiclePriceList.forEach((obj: any) => {
      this.calculateDistance(obj)
    })
  }
  calculateDistance(vehiclePriceList: any) {
    console.log(this.dist, this.durat);

    this.unitDistancePrice = +vehiclePriceList.timeUnit
    this.unitTimePrice = +vehiclePriceList.distance
    this.basePrice = +vehiclePriceList.basePrice
    this.basePriceDistance = +vehiclePriceList.distanceUnit
    this.minFare = +vehiclePriceList.minFare
    var countBill
    // console.log(this.dist)
    // console.log(this.durat)

    if (this.dist > this.basePriceDistance) {
      countBill = ((this.dist - this.basePriceDistance) * this.unitDistancePrice) + (this.durat * this.unitTimePrice) + this.basePrice
      // console.log('inif',countBill)
    } else {
      countBill = this.basePrice + this.durat * this.unitTimePrice
      // console.log('in',countBill)
    }
    var data: any = {}
    data.name = this.totalAmount
    if (countBill > this.minFare) {
      this.totalAmount = countBill
    } else {
      this.totalAmount = this.minFare
    }

    // console.log(vehiclePriceList)
    var vehiclePrice = Math.round(this.totalAmount * 100) / 100;
    console.log(vehiclePrice)
    vehiclePriceList.total = vehiclePrice
    // console.log(vehiclePriceList)
    // var dist=+this.dist
    // var durat=+this.durat
  }
  getCardDataList() {
    this.cardApiService.getCard().subscribe(
      (data: any) => {
        this.cardList = data.response
        console.log(this.cardList);
        // this.cardNumber=data.cardNumber
        // this.checkUserCardExists()
      }
    )
  }
  // bookNow(){
  //   const dataobj=new Date()
  //   this.ScheduleDate=dataobj.toLocaleDateString()
  //   this.ScheduleTime=dataobj.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
  //   console.log(this.ScheduleTime)
  //   console.log(this.ScheduleDate)
  // }
  storeUserData() {
    if (this.file != undefined && this.userName != '' && this.userEmail != '' && this.userPhone != '' && this.countryCode != '') {
      var data = new FormData()
      data.append('image', this.file)
      data.append('name', this.userName)
      data.append('email', this.userEmail)
      data.append('mobile', this.userPhone)
      data.append('country', this.countryId)
      console.log(data)
      this.loaderApi.show()
      this.userApi.storeUser(data).subscribe((userData: any) => {
        this.loaderApi.hide()
        if (userData.success) {

          this.loginservice.showMessage({ message: 'user stored successfully', bool: true })
          this.resetForm()
        } else {
          var string = 'something went wrong'
          if (userData.message == 'duplicate') {
            string = 'already exists'
          }
          this.loginservice.showMessage({ message: string })
        }
      })
      this.showDetails = true
      this.showForm = false
    } else {
      if (this.file == undefined) { this.isImageEmpty = true } else { this.isImageEmpty = false }
      if (this.userName == '') { this.isName = true } else { this.isName = false }
      if (this.userEmail == '') { this.isEmail = true } else { this.isEmail = false }
      if (this.userPhone == '') { this.isNumber = true } else { this.isNumber = false }
      if (this.countryCode == '') { this.isCountry = true } else { this.isCountry = false }
    }
  }
  onSelectCountry() {
    const filteredCountry = this.countryList.filter((obj: any) => obj._id === this.selectedCountry._id)
    this.countryName = filteredCountry[0].countryName
    this.countryId = filteredCountry[0]._id
    this.countryCode = filteredCountry[0].countryCode
  }
  onSelectFile(event: any) {
    this.file = event.target.files[0];
    if (this.file.type.startsWith("image/")) {
      this.isImageEmpty = false
    } else {
      this.isImageEmpty = true
      this.file = undefined
      this.loginservice.showMessage({ message: 'only image are allowed', color: 'orange' })
    }
  }
  loadAutocompleteService() {
    // Load the Places Autocomplete service
    this.from = document.getElementById('fromInput')
    this.to = document.getElementById('toInput')
    this.stopValue = document.getElementById('addStop')
    var options = {
      types: ['establishment'],
    }
    this.stopAutoComplete = new google.maps.places.Autocomplete(this.stopValue, options)
    this.autocompleteFrom = new google.maps.places.Autocomplete(this.from, options);
    this.autocompleteTo = new google.maps.places.Autocomplete(this.to, options);
    google.maps.event.addListener(this.autocompleteTo, 'place_changed', () => {
      this.addStopBtn = true
      // this.removePath()
      this.drawRoute()
      this.showService = true
    })
    google.maps.event.addListener(this.stopAutoComplete, 'place_changed', () => {
      var geocoder = new google.maps.Geocoder();
      var selectedPlaces = this.stopAutoComplete.getPlace()
      var lat = selectedPlaces.geometry.location.lat()
      var lng = selectedPlaces.geometry.location.lng()
      this.getStop = { lat: lat, lng: lng }
    });
  }
  
  drawRoute() {
    var src = this.from.value
    var dest = this.to.value
    this.request = {
      origin: src,
      destination: dest,
      waypoints: this.wayPoints,
      travelMode: "DRIVING",
    }
    // if(this.stopAutoComplete){
    //   var request=this.request.waypoints.push(this.getStop)
    //  }
    this.directionsService.route(this.request, (result: any, status: any) => {
      if (status == "OK") {
        this.directionsRenderer.setDirections(result);
      }
      // console.log('getting directions')
      this.getDetails();
    });
  }
  // removePath(){
  //   if(this.directionsRenderer){
  //     this.directionsRenderer.setMap(null);
  //     // this.directionsRenderer=null
  //   }
  // }
  removePlace(item: any) {
    this.wayPoints = this.wayPoints.filter((obj: any) => obj.location != item.location)
    this.drawRoute()
    if (!this.addStopBtn) {
      this.addStopBtn = true
    }
  }
  addStops() {
    var index = this.wayPoints.findIndex((obj: any) => obj.location == this.stopValue.value)
    if (index == -1) {
      this.wayPoints.push({ location: this.stopValue.value })
      // console.log(this.wayPoints)
      this.drawRoute()
    } else {
      this.loginservice.showMessage({ message: 'already stop added', color: 'orange' })
    }
    if (this.wayPoints.length == this.stopLimitData) {
      this.addStopBtn = false
      this.loginservice.showMessage({ message: 'stop limit reached' })
    }
  }
  loadMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 12
    });
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);
    this.loaderApi.hide()
  }
  resetForm() {
    this.file = null
    this.userName = ''
    this.userEmail = ''
    this.userPhone = ''
    this.selectedCountry = ''
    this.userPhone = ''
  }
  resetMessage() {
    this.isName = false
    this.isImageEmpty = false
    this.isEmail = false
    this.isNumber = false
  }
  getVehiclePriceService(item: any) {
    this.vehicleService = item.vehicleTypeId._id
    this.serviceCost = item.total
    console.log('cost: ' + this.serviceCost, ' id: ' + this.vehicleService)
  }
  timeOption() {
    const dataobj = new Date()
    this.ScheduleDate = dataobj.toLocaleDateString()
    this.ScheduleTime = dataobj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (this.setTime == 'book now') {
      this.istime = true
      this.time = this.ScheduleTime
      this.date = this.ScheduleDate
      this.showTimePicker = false
      this.setTime = ''
    } else {
      this.showTimePicker = true
      // time=this.time
      // date=this.date
      // this.getTime()
    }
  }
  getTime() {
    this.istime = true
    this.timePicker = document.getElementById('timePicker');
    const today = new Date().toISOString().split('T')[0];
    this.timePicker.min = today
    this.timePicker.addEventListener('input', this.timeEvent)
    var selectedTime = this.timePicker.value;
    console.log(selectedTime);
    const dataobj = new Date(selectedTime)
    console.log(dataobj)
    const date = dataobj.toLocaleDateString()
    console.log(date);
    const time = dataobj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    console.log(time);
    this.time = time
    this.date = date
    this.showTimePicker = false
  }
  storeCreateRideData() {
    // var setTime=this.timeOption()
    // this.time=setTime.time
    // this.date=setTime.date
    console.log(this.autocompleteFrom)
    console.log(this.autocompleteTo)
    console.log(this.date)
    console.log(this.time)
    var cardId
    if(this.paymentType=='card'){
      cardId=this.cardId
  }
    if (this.from != '' && this.to != '' && this.stopValue != '') {
      this.createRideData = {
        userId: this.userData[0]._id,
        stopList: this.userDestination,
        pickUp: this.pickup,
        cardId: cardId,
        drop: this.drop,
        serviceId: this.vehicleService,
        serviceCost: this.serviceCost,
        distance: this.distance,
        duration: this.duration,
        date: this.date,
        time: this.time,
        paymentType: this.paymentType,
      }
      console.log(this.createRideData)
      this.loaderApi.show()
      this.createRideApi.storeCreateRide(this.createRideData).subscribe(
        (data: any) => {
            this.loaderApi.hide()
            if(data.success){
              this.loginservice.showMessage({ message: data.message, bool: true })
            }else{
              this.loginservice.showMessage({message:data.message,bool:data.success})
            }
            this.resetForm()
            this.wayPoints = ''
            this.waypointsList = false
            this.showService = false
            this.vehicleService = undefined
            // this.showDestination=false
            this.showDestInfo = false
            // this.waypointsList=false
            this.timePicker = undefined
            this.from.value = ''
            this.setTime = undefined
            this.to.value = ''
            console.log(data)
          })
    } else {
      alert('Booking Information Empty')
    }
  }
  validateNum(e: any, ln: any, id: any) {
    if (e.target.value.length == ln) {
      var elm: any = document.getElementById(id)
      elm.focus()
    }
  }
  onSelectOption() {
    // console.log(this.paymentType)
    // var type:any=document.getElementsByName('paymentOption')
    var radioButtons:any=document.getElementsByName('paymentOption')
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        this.paymentType= radioButton.value;
        break; // Stop the loop once a selected radio button is found
      }
    }
    console.log(this.paymentType);
    if (this.paymentType == 'card') {
      this.isUserCard = true
      this.checkUserCardExists()
    } else {
      // this.paymentOption()
      this.isUserCard = false
    }
  }
  // getCreateRideData(){

  //   this.createRideApi.showCreateRide().subscribe({
  //     next:(data:any)=>{
  //       this.createRideDataList=data
  //       console.log(this.createRideDataList)
  //     },error:(err:any)=>{
  //       console.log(err)
  //     }})    
  // }
}