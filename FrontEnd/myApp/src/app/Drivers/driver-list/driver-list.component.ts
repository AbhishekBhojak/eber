import { Component } from '@angular/core';
import { CountryApiService } from '../../services/country-api.service'
import { CityApiService } from '../../services/city-api.service'
import { DriverApiService } from '../../services/driver-api.service'
import { SessionService } from 'src/app/services/session.service';
import { VehicleTypeApiService } from 'src/app/services/vehicle-type-api.service';
import { filter } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { LoginApiService } from 'src/app/services/login-api.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent {
  cityList: any = []
  countryList: any = []
  driverList: any = []
  selectedCountry: any
  driverQuery: any = ''
  driverId: any
  vehicleId: any = ''
  driverStatus: any = ''
  driverStat: boolean = true
  isName: boolean = false
  isEmail: boolean = false
  isNumber: boolean = false
  isCity: boolean = false
  isCountry: boolean = false
  isStatus: boolean = false
  isEmptyImage: boolean = false
  selectedData: any
  selectedVehicleType: any
  pageLimit: any = 6
  vehicleTypeList: any = []
  newRange: any
  selectedCity: any
  filterVehicleType: any = []
  vehicleTypeId: any = ''
  countryName: any = ''
  file: any = ''
  range: any = 5;
  start: number = 0;
  pageList: any = []
  end = this.start + this.range;
  pageNo: any = 1;
  pageCount: any
  countryCode: any = ''
  filteredCity: any
  filteredCountry: any
  countryId: any = ''
  cityId: any = ''
  driverName: any = ''
  driverEmail: any = ''
  driverPhone: any = ''
  driver: any = ''
  socket: any
  selectedVehicle: any
  storeButton: boolean = true
  deleteButton: boolean = false
  editButton: boolean = false
  constructor(private countryApi: CountryApiService, private cityApi: CityApiService, private driverApi: DriverApiService, private sessionApi: SessionService, private vehicleTypeApi: VehicleTypeApiService, private socketService: SocketService, private loginApi: LoginApiService, private loaderApi: LoaderService) { }
  ngOnInit() {
    this.loaderApi.show()
    this.getcountry()
    this.getVehicleType()
    this.getCity()
    this.getDriverData()
    setTimeout(() => {
      this.socket = this.socketService.getSocket()
      this.socket.on('update', (data: any) => {
        console.log(data)
        this.getDriverData()
        console.log('driver data socket updated')
      })
    }, 500)
  }
  getcountry() {
    this.countryApi.showAllCountryData().subscribe((data: any) => {
      this.countryList = data
    })
  }
  getCity() {
    this.cityApi.getCity().subscribe((data: any) => {
      this.cityList = data
    })
  }
  getVehicleType() {
    this.vehicleTypeApi.getVehicleType().subscribe({
      next: (data: any) => {
        this.vehicleTypeList = data
      }, error: (err) => { console.log(err) }
    })
  }
  onSelectCountry() {
    this.filteredCountry = this.countryList.filter((obj: any) => obj._id === this.selectedCountry._id)
    console.log(this.filteredCountry)
    this.countryName = this.filteredCountry[0].countryName
    this.countryId = this.filteredCountry[0]._id
    this.countryCode = this.filteredCountry[0].countryCode
  }
  onSelectCity() {
    var filteredCity = this.cityList.filter((obj: any) => obj._id === this.selectedCity._id)
    console.log(filteredCity)
    this.cityId = filteredCity[0]._id
  }
  onSelectVehicleType() {
    var filtervehicle = this.vehicleTypeList.filter((obj: any) => obj._id === this.selectedVehicleType._id)
    this.vehicleId = filtervehicle[0]._id
    console.log(this.vehicleId)
  }
  onSelectFile(event: any) {
    this.file = event.target.files[0];
    if (this.file.type.startsWith("image/")) {
      this.isEmptyImage = false
    } else {
      this.isEmptyImage = true
      this.file = undefined
      this.loginApi.showMessage({ message: 'only image are allowed', color: 'orange' })
    }
  }
  find(){
    var data={query:this.driverQuery}
    this.driverApi.find(data).subscribe((data:any) => {
      console.log(data);
    })
  }
  noEmpty(fld: any) {
    console.log(fld);
    switch (fld) {
      case 'image': {
        if (this.file != undefined) {
          this.isEmptyImage = false
          break;
        }
        else {
          this.isEmptyImage = true
          break;
        }
      }
      case 'name': {
        if (this.driverName != '') {
          this.isName = false
          break;
        }
        else {
          this.isName = true
          break;
        }
      }
      case 'email': {
        if (this.driverEmail != '') {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          var test = regex.test(this.driverEmail);
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
        } else {
          this.isCountry = true
          break;
        }
      }
      case 'city': {
        if (this.selectedCity != '') {
          this.isCity = false
          break;
        } else {
          this.isCity = true
          break;
        }
      }
      case 'mobile': {
        if (this.driverPhone != '') {
          this.isNumber = false
          break
        } else {
          this.isNumber = true
          break;
        }
      }
    }
  }
  validateNum(e: any, ln: any, id: any) {
    if (e.target.value.length == ln) {
      var elm: any = document.getElementById(id)
      elm.focus()
    }
  }
  onChangeLimit() {
    this.pageNo = 1
    this.getDriverData()
  }
  findDriver() {
    this.pageNo = 1
    this.getDriverData()
  }
  getDriverData(pg?: any) {
    if (pg) {
      if (pg == this.pageNo) {
        return
      }
      this.pageNo = pg
    }
    var data: any = {
      pagelimit: Number(this.pageLimit),
      pageno: Number(this.pageNo),
      query: this.driverQuery
    }
    this.driverApi.getDriver(data).subscribe({
      next: (data: any) => {
        this.loaderApi.hide()
        console.log(data);
        this.pageCount = data.count
        this.countPages(this.pageCount)
        this.driverList = data.response
        // if(data.success){
        //   this.loginApi.showMessage({ message:data.message,bool:data.success})
        // }else{
        //   this.loginApi.showMessage({ message:data.message,})
        // }
      }, error: (err) => {
        console.log(err)
      }
    })
  }
  countPages(page: any) {
    this.pageList = []
    var pages = page / this.pageLimit
    if (page % this.pageLimit) {
      pages++
    }
    for (var i = 1; i <= pages; i++) {
      this.pageList.push(i)
    }
  }
  resetMessage() {
    this.isName = false
    this.isEmail = false
    this.isNumber = false
    this.isEmptyImage = false
    this.isCity = false
    this.isCountry = false
    this.isStatus = false
  }
  storeDriverData() {
    if (this.driverName != '' && this.driverEmail != '' && this.driverPhone != '' && this.countryCode != '' && this.selectedCity != null) {
      this.resetMessage()
      var data = new FormData()
      if (this.file) {
        data.append('image', this.file)
      }
      data.append('driverName', this.driverName)
      data.append('driverEmail', this.driverEmail)
      data.append('country', this.countryId)
      data.append('city', this.cityId)
      data.append('driverPhone', this.driverPhone)
      this.loaderApi.show()
      this.driverApi.storeDriver(data).subscribe({
        next: (driverData: any) => {
          this.loaderApi.hide()
          if (driverData.success) {
            this.loginApi.showMessage({ message: 'driver stored successfully', bool: true })
            this.resetForm()
            this.getDriverData()
          } else {
            var string = 'something went wrong'
            if (driverData.message == 'duplicate') {
              string = 'driver already exist'
            }
            this.loginApi.showMessage({ message: string })
          }
          console.log(driverData)
        }, error: (err) => {
          console.log(err)
        }
      })
    } else {
      console.log('form field is empty')
      if (this.driverName == '') { this.isName = true } else { this.isName = false }
      if (this.driverEmail == '') { this.isEmail = true } else { this.isEmail = false }
      if (this.driverPhone == '') { this.isNumber = true } else { this.isNumber = false }
      if (this.file == '') { this.isEmptyImage = true } else { this.isEmptyImage = false }
      if (this.countryCode == '') { this.isCountry = true } else { this.isCountry = false }
      if (this.selectedCity == undefined) { this.isCity = true } else { this.isCity = false }
    }
  }
  onEditButton(data: any) {
    this.storeButton = false
    this.selectedData = data
    console.log(this.selectedData)
    this.driverId = this.selectedData._id
    this.driverName = this.selectedData.driverName
    this.driverEmail = this.selectedData.driverEmail
    this.driverPhone = this.selectedData.driverPhone
    var filterCountry = this.countryList.filter((item: any) =>
      item._id.toString() == this.selectedData.countryId._id.toString()
    )
    var filterCity = this.cityList.filter((item: any) =>
      item._id.toString() == this.selectedData.cityId._id.toString()
    )
    console.log(filterCountry)
    console.log(filterCity)
    this.selectedCountry = filterCountry[0].countryName
    this.selectedCity = filterCity[0].cityName
    // this.selectedVehicleType=filterVehicleType[0].vehicleName
    // this.countryId=filterCountry[0]._id
    // this.cityId=filterCity[0]._id
    // this.countryCode= filterCountry[0].countryCode
    // this.editButton=true

    this.editButton = true
    this.isStatus = true
  }
  updateDriverData() {
    // if(!this.file && this.driverName==this.selectedData.driverName && this.driverEmail==this.selectedData.driverEmail){
    //   this.loginApi.showMessage({message:'No data updated'})
    //   return
    // }
    this.vehicleTypeId = this.selectedData._id.toString()

    console.log(this.vehicleTypeId)
    var data = new FormData()
    if (this.file) {
      data.append('image', this.file)
    }
    if (this.driverName != this.selectedData.driverName)
      data.append('Name', this.driverName)
    if (this.driverEmail != this.selectedData.driverEmail)
      data.append('Email', this.driverEmail)
    if (this.driverPhone != this.selectedData.driverPhone)
      data.append('Phone', this.driverPhone)
    if (this.cityId != this.selectedData.cityId._id && this.cityId != '')
      data.append('City', this.cityId)
    if (this.driverStatus != this.selectedData.driverStatus)
      data.append('Status', this.driverStatus)
    if (this.countryId != this.selectedData.countryId._id && this.countryId != '')
      data.append('Country', this.countryId)
    if (this.vehicleId != undefined) {
      data.append('Vehicle', this.vehicleId)
    }
    // data.append('vehicleTypeId',this.vehicleTypeId)
    // console.log(data)
    data.append('_id', this.selectedData._id)
    console.log(data);
    this.loaderApi.show()
    this.driverApi.updateDriver(data).subscribe({
      next: (res: any) => {
        console.log(res)
        this.loaderApi.hide()
        if (res.success) {
          this.loginApi.showMessage({ message: res.message, bool: res.success })
        } else {
          this.loginApi.showMessage({ message: res.message, bool: res.success })
        }
        this.getDriverData()
        this.driverStatus=undefined
        this.editButton = true
        this.resetForm()
        this.editButton = false
        this.isStatus = false
        this.vehicleId = ''
        this.storeButton = true
      }, error: (err) => {
        console.log(err)
      }
    })
  }
  onDeleteButton(data: any) {
    this.selectedData = data
    this.driverId = this.selectedData._id
    if (this.driverId == this.selectedData._id)
      var data = this.driverId
    var decision = confirm('are you sure you want to delete this driver')
    if (decision == true) {
      this.loaderApi.show()
      if(data.success){

        this.driverApi.deleteDriver({ _id: data }).subscribe((dataDeleted: any) => {
          this.loginApi.showMessage({ message: 'driver deleted successfully', bool: true })
          this.getDriverData()
          console.log(dataDeleted)
          this.resetForm()
        }
      )
    } else{
      this.loginApi.showMessage({message:data.message,bool:data.success})
    }
  }
  else {
    this.resetForm()
  }
}
  resetForm() {
    this.file = ''
    this.driverName = ''
    this.driverEmail = ''
    this.driverPhone = ''
    this.countryId = ''
    this.cityId = ''
    this.countryCode = ''
    this.selectedCity = ''
    this.selectedCountry = ''
    this.editButton = false
    this.storeButton = true
    this.resetMessage()
  }
}
