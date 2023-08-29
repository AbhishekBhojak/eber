import { Component, OnInit } from '@angular/core';
import { CountryApiService } from 'src/app/services/country-api.service';
import { CityApiService } from 'src/app/services/city-api.service'
import { fromEventPattern } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { LoginApiService } from 'src/app/services/login-api.service';
import { LoaderService } from 'src/app/services/loader.service';
declare var google: any
@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  countryList: any = []
  selectedCountry: any
  selectedCity: any
  showCityList: boolean = false
  queryCity: any=''
  canSave: boolean = false
  allData: any
  map: any
  citySelected:any
  isAllCities: boolean = false
  editCoords:boolean=false
  defaultOption: any
  updateCoords:boolean=false
  countryName: any
  autoComplete:any
  isAutoComplete: boolean = true
  autoCompleteField: any
  drawingManager:any
  updatedCoordinates:any=[]
  cityData: any = {}
  coords: any = [];
  mongoCityList: any = []
  cityName: any;
  findCity: any;
  updatedCityName:any=''
  polygon: any
  path: any;
  allPolygons: any=[]
  paths: any;
  drawnLine:any
  constructor(private countryApi: CountryApiService, private cityApi: CityApiService,private sessionApi:SessionService,private loginApi:LoginApiService,private loaderApi:LoaderService) { }
  ngOnInit(): void {
    this.loaderApi.show()
    this.getCountries()
    this.onGetCity()
    setTimeout(() => {
      this.loadMap()
    }, 500);
   }

  onSelectCountry() {
    this.editCoords=false
    this.updateCoords=false
    this.countryName = this.selectedCountry.countryName    
    if(this.polygon){
      console.log(this.polygon)
      this.isAllCities=true
        this.removePolygon()
        console.log('in if')
      }
      // else{
        console.log('in else')
        this.isAllCities=false
        this.mongoCityList.forEach((city:any) => {
          if(city.countryId==this.selectedCountry._id){
            this.allPolygon(city)
          }
        })
      // }
      this.isAutoComplete = false
    this.autoComplete.setComponentRestrictions({ country: this.selectedCountry.countryAlt })
    google.maps.event.addListener(this.autoComplete, "place_changed", () => {
      if(this.polygon){
        this.removePolygon()
      }
      var near_place = this.autoComplete.getPlace();
        this.cityName = near_place.name
        this.findCity=this.mongoCityList.findIndex((data:any)=>data.cityName===this.cityName);
        if(this.findCity==-1){
      var latitude = near_place.geometry.location.lat();
      var longitude = near_place.geometry.location.lng();
      this.map.setCenter({ lat: latitude, lng: longitude });
      this.drawingManager.setOptions({
        drawingMode:google.maps.drawing.OverlayType.POLYGON
      })
      this.drawingManager.setMap(this.map);
  }else{
    this.loginApi.showMessage({message:`${this.cityName} city already exist`}) 
    this.emptyAutocomplete()
   }
    })
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        strokeOpacity:1,
        fillOpacity:0
      }
    });
    google.maps.event.addListener(
      this.drawingManager,
      "overlaycomplete",
      (event: any) => {
        // if (event.type == google.maps.drawing.OverlayType.POLYGON) {
        var polygon = event.overlay;
        this.drawingManager.setDrawingMode(null);
        var path = polygon.getPath().getArray();
        this.coords =this.generateCoords(path)
        console.log(this.coords)
        this.isAllCities=false
        this.drawnLine=polygon
        this.drawPolygon(this.coords);
        // Do something with the polygon path coordinates
        this.canSave = true
      }
    );
  }
  
 generateCoords(path:any){
  var coordinates= [];
  for (var i = 0; i < path.length; i++) {
    coordinates.push({ lat: path[i].lat(), lng: path[i].lng() });
  }
  return coordinates;
 }
  drawPolygon(coordinates: any) {
    let bool
    if(this.editCoords){
      bool=true
  }else{
      bool=false
  }
  this.polygon = new google.maps.Polygon({
    paths: coordinates,
    strokeColor: "#000000",
    strokeOpacity: 1,
    strokeWeight: 3,
    fillColor: "#0f0f0f",
    fillOpacity: 0.3,
    editable: bool,
  });
    this.polygon.setMap(this.map);
    this.allPolygons.push(this.polygon)
  }
  cancelStoreCity(){
    this.drawingManager.setOptions({
      drawingMode:google.maps.drawing.OverlayType.POLYGON
    })
    this.drawnLine.setMap(null)
    this.removePolygon()
  }
  removePolygon(){
    for(var i=0;i<this.allPolygons.length;i++){
      this.allPolygons[i].setMap(null);
    }
    this.allPolygons=[]
      this.canSave=false
  }
  getCountries() {
    this.countryApi.showAllCountryData().subscribe((data: any) => {
      this.countryList = data
    })
  }
  loadMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 12
    });
    var input = document.getElementById('autocomplete-input')
    this.autoCompleteField = input
    this.autoComplete = new google.maps.places.Autocomplete(input, {
      types: ['(cities)'] // Restrict results to cities only
    }
    )
    this.loaderApi.hide()
  }
  emptyAutocomplete() {
    this.autoCompleteField.value = '';
  }
  onStoreCity() {
    this.cityData = {
      countryId: this.selectedCountry._id,
      cityName: this.cityName,
      areaCoords: this.coords,
    }
    console.log(this.cityData);
    this.loaderApi.show()
    this.cityApi.storeCity(this.cityData).subscribe({
      next: (data) => {
    this.loginApi.showMessage({message:`${this.cityName} city Added`,bool:true}) 
    this.drawnLine.setMap(null)
        this.drawingManager.setDrawingMode(null);
        this.onGetCity()
        console.log(data)
        this.emptyAutocomplete()
        this.canSave=false
        this.loaderApi.hide()

      }, error: (err) => {
        console.log(err)
      }
    })
  }
  onGetCity() {
    this.editCoords=false
    this.cityApi.getCity().subscribe((data) => {
      this.mongoCityList = data
    })
  }
  allPolygon(data:any) {
    console.log(data)
    // if(this.polygon){
    //   this.removePolygon()
    //   console.log('in if')
    // }else{
      console.log('in else')
      this.drawPolygon(data.areaCoords)
    // }
      var bounds = new google.maps.LatLngBounds();
      this.polygon.getPath().forEach( (path:any)=> {
        bounds.extend(path);
      });
  var center = bounds.getCenter();
  this.map.setCenter(center);
  }
  onCitySelect(data: any) {
    console.log(data)
    this.isAllCities=false
    this.editCoords=true
    this.selectedCity=data
    this.updatedCityName=data.cityName
    if(this.polygon){
      this.removePolygon()
      console.log('in if')
    }
      console.log('in else')
      this.drawPolygon(data.areaCoords)
      var bounds = new google.maps.LatLngBounds();
      this.polygon.getPath().forEach( (path:any)=> {
        bounds.extend(path);
  });
    
  var center = bounds.getCenter();
    this.map.setCenter(center);
    this.updatedCoords()
  }
cancelEditCoords(){
  this.onCitySelect(this.selectedCity)
}
  updatePolygon(polygon:any){
   var data={
      areaCoords:this.updatedCoordinates,
      _id:this.selectedCity._id
   }
   this.loaderApi.show()
    this.cityApi.updateCity(data).subscribe((data:any)=>{
    this.loginApi.showMessage({message:`${this.updatedCityName} updated`,color:'green'}) 
    this.loaderApi.hide()
      this.onGetCity()
      console.log(data)
    })
    this.updateCoords=false
  }
  updatedCoords(){
        var polygon=this.polygon
    google.maps.event.addListener(polygon.getPath(), "set_at", (index:any)=> {
      this.updateCoords=true;
      const path = polygon.getPath().getArray()
      this.updatedCoordinates=this.generateCoords(path)
      console.log(this.updatedCoordinates)
    });
    google.maps.event.addListener(polygon.getPath(), "insert_at", (index:any) =>{
      this.updateCoords=true;
      var path = polygon.getPath().getArray()
      this.updatedCoordinates=this.generateCoords(path)
      console.log(this.updatedCoordinates);
    });
    // if(){
    //   console.log()
    //   this.updateCoords=true;
    // }
    }
}