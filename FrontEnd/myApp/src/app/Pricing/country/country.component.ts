import { Component, OnInit  } from '@angular/core';
import { filter } from 'rxjs';
import { CountryApiService } from 'src/app/services/country-api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { LoginApiService } from 'src/app/services/login-api.service';
import { SessionService } from 'src/app/services/session.service';
const  countryApiList= require ('src/app/Pricing/country/country.js')
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  validCountry: boolean = false;
  queryData:any=''
  showFlag: boolean=false
  selectedCountry:any='Add Country'
  selectedCountryData:any
  allData:any=countryApiList
  allCD:any=[]
  cntName:any=''
  countryName:any=''
  defaultOptionText:any='Select Country'
  index:any
  countries:any=[]
  hideCountryForm:boolean=true
  countryDat:any=''
  countryZone:any=''
  countryCurrency:any=''
  countryCurrencySymbol:any=''
  countryCurrencyName:any=''
  countryCode:any=''
  countryFlag:any=''
  innerHtml:any='select country'
  searchedCountry:any=[]
  ngOnInit(): void {
this.loaderApi.show()
    this.showAllCountryData()
  }
constructor(private countryData:CountryApiService,private sessionApi:SessionService,private loginApi:LoginApiService,private loaderApi:LoaderService) {}
countryList=[
  "Kuwait",
  "Austria",
  "Mayotte",
  "Tunisia",
  "Japan",
  "Guyana",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Saint Martin",
  "Guatemala",
  "Venezuela",
  "French Southern and Antarctic Lands",
  "Cape Verde",
  "Azerbaijan",
  "Guernsey",
  "Kenya",
  "South Sudan",
  "Myanmar",
  "Liechtenstein",
  "Martinique",
  "Australia",
  "Costa Rica",
  "Palestine",
  "Spain",
  "Guinea-Bissau",
  "Åland Islands",
  "Sierra Leone",
  "Philippines",
  "Togo",
  "Russia",
  "Haiti",
  "South Korea",
  "Samoa",
  "Aruba",
  "Afghanistan",
  "Bouvet Island",
  "Bahamas",
  "Georgia",
  "Cayman Islands",
  "North Macedonia",
  "Syria",
  "Hong Kong",
  "Chile",
  "Zimbabwe",
  "Caribbean Netherlands",
  "Netherlands",
  "Canada",
  "Equatorial Guinea",
  "Eswatini",
  "Oman",
  "United States",
  "Heard Island and McDonald Islands",
  "Romania",
  "South Africa",
  "Mozambique",
  "Trinidad and Tobago",
  "Bahrain",
  "Republic of the Congo",
  "Lebanon",
  "Réunion",
  "Estonia",
  "Bangladesh",
  "Ethiopia",
  "Peru",
  "South Georgia",
  "Ecuador",
  "Vatican City",
  "Mauritius",
  "American Samoa",
  "Saint Pierre and Miquelon",
  "Cuba",
  "British Indian Ocean Territory",
  "Vietnam",
  "Benin",
  "Greece",
  "Grenada",
  "Belize",
  "China",
  "Montenegro",
  "Thailand",
  "Guam",
  "Comoros",
  "Laos",
  "Mali",
  "Germany",
  "Suriname",
  "Gambia",
  "Maldives",
  "Tonga",
  "Antigua and Barbuda",
  "Guinea",
  "Curaçao",
  "Panama",
  "Papua New Guinea",
  "New Caledonia",
  "Croatia",
  "Palau",
  "United States Virgin Islands",
  "Cambodia",
  "Puerto Rico",
  "French Polynesia",
  "Nicaragua",
  "Colombia",
  "Mauritania",
  "Botswana",
  "Fiji",
  "Latvia",
  "Svalbard and Jan Mayen",
  "Bermuda",
  "Uganda",
  "Bosnia and Herzegovina",
  "Gabon",
  "Chad",
  "Cocos (Keeling) Islands",
  "Kazakhstan",
  "Pitcairn Islands",
  "Guadeloupe",
  "Sudan",
  "Dominica",
  "Qatar",
  "Barbados",
  "Turkey",
  "Denmark",
  "Marshall Islands",
  "Yemen",
  "Antarctica",
  "São Tomé and Príncipe",
  "Turkmenistan",
  "North Korea",
  "Portugal",
  "Eritrea",
  "Gibraltar",
  "Mongolia",
  "Kosovo",
  "Anguilla",
  "Malawi",
  "Tuvalu",
  "Moldova",
  "Brunei",
  "United States Minor Outlying Islands",
  "Finland",
  "Ghana",
  "Dominican Republic",
  "Northern Mariana Islands",
  "Czechia",
  "Morocco",
  "Honduras",
  "Israel",
  "Madagascar",
  "Luxembourg",
  "Armenia",
  "Turks and Caicos Islands",
  "Falkland Islands",
  "Angola",
  "Cyprus",
  "Indonesia",
  "Uzbekistan",
  "Burundi",
  "Albania",
  "Saint Barthélemy",
  "Bolivia",
  "Kyrgyzstan",
  "United Arab Emirates",
  "Paraguay",
  "Tanzania",
  "Argentina",
  "Pakistan",
  "Nepal",
  "New Zealand",
  "Switzerland",
  "Norfolk Island",
  "Sweden",
  "Saint Lucia",
  "Uruguay",
  "Mexico",
  "Somalia",
  "Montserrat",
  "Norway",
  "Seychelles",
  "Nauru",
  "Bhutan",
  "Rwanda",
  "Hungary",
  "Slovenia",
  "Sint Maarten",
  "India",
  "French Guiana",
  "Italy",
  "Singapore",
  "Ireland",
  "Andorra",
  "Iceland",
  "Micronesia",
  "Faroe Islands",
  "Saint Kitts and Nevis",
  "Niger",
  "France",
  "Djibouti",
  "Liberia",
  "Taiwan",
  "Jordan",
  "Greenland",
  "Libya",
  "Kiribati",
  "Cook Islands",
  "Lesotho",
  "Monaco",
  "Malaysia",
  "Wallis and Futuna",
  "Saudi Arabia",
  "Bulgaria",
  "Burkina Faso",
  "Brazil",
  "Lithuania",
  "Jersey",
  "Algeria",
  "Solomon Islands",
  "Sri Lanka",
  "San Marino",
  "United Kingdom",
  "Nigeria",
  "Slovakia",
  "Cameroon",
  "Namibia",
  "Egypt",
  "Saint Vincent and the Grenadines",
  "Belarus",
  "Ukraine",
  "Christmas Island",
  "Niue",
  "Jamaica",
  "Zambia",
  "Senegal",
  "Belgium",
  "Central African Republic",
  "Iran",
  "Iraq",
  "Timor-Leste",
  "Isle of Man",
  "Macau",
  "El Salvador",
  "Malta",
  "Poland",
  "Serbia",
  "Ivory Coast",
  "Western Sahara",
  "DR Congo",
  "Tajikistan",
  "Vanuatu",
  "Tokelau",
  "British Virgin Islands"
]
findCountry(){
  
  var search={
      query:this.queryData
    }
    this.countryData.findCountry(search).subscribe((data:any)=>{
      this.searchedCountry=[...data]
      if(this.queryData!=''){
        this.countries=this.searchedCountry
      }else{
        this.countries=this.allCD
      }
    })
}
onCountrySelect(){  
  this.loaderApi.show()
  this.countryData.searchCountry({country:this.selectedCountry}).subscribe((data:any) => {
    this.index=!data.success
  this.loaderApi.hide()
 
  if(this.index){
    var temp=this.allData.filter((data:any)=>data.name.common==this.selectedCountry)
    var countrybox:any=document.getElementById('countryGrid')
    // countrybox.style.height='40vh'
  this.selectedCountryData=temp[0]
  this.countryName=this.selectedCountryData.name.common
  this.countryFlag=this.selectedCountryData.flags.png
  this.countryZone=this.selectedCountryData.timezones[0]
  this.countryCode=this.selectedCountryData.idd.root+this.selectedCountryData.idd.suffixes[0]
  this.countryCurrency=Object.keys(this.selectedCountryData.currencies)
  this.countryCurrencySymbol =this.selectedCountryData.currencies[this.countryCurrency].symbol
  this.countryCurrencyName =this.selectedCountryData.currencies[this.countryCurrency].name
  this.validCountry=true
  this.showFlag=true
  }
  else{
    this.loginApi.showMessage({message:'Country Already Exists'})
  }  
})// this.emptyfield()
}
emptyfield(){
  this.countryName=''
  this.countryFlag=''
  this.countryZone=''
  this.countryCode=''
  this.countryCurrencyName=''
  this.countryCurrencySymbol=''
  this.selectedCountry='Add country'
  this.loaderApi.hide()
}
storeCountryData(){
  console.log("countryForm")
  this.countryDat={
    countryName:this.countryName,
    countryFlag:this.countryFlag,
    countryZone:this.countryZone,
    countryCode:this.countryCode,
    currencyName:this.countryCurrencyName,
    currencySymbol:this.countryCurrencySymbol,
    countryAlt:this.selectedCountryData.altSpellings[0]
}
console.log(this.countryDat)
this.loaderApi.show()
  this.countryData.storeCountryData(this.countryDat).subscribe({next:(data:any)=>{
    this.loginApi.showMessage({message:`${this.countryName} Country Stored`,bool:true})
    this.showAllCountryData()
    this.emptyfield()
    this.showFlag=false
    this.validCountry=false
  },error:(err:any)=>{
    console.log(err)
  }})
  // this.emptyfield()
}
cancelAddCountry(){
this.showFlag=false
this.validCountry=false
  this.emptyfield()
}
showAllCountryData(){
  // var search={
  //   query:this.queryData
  // }
  // var select:any=document.getElementById("cnt")
  // select.style.color='red'
  // select.innerHtml=''
  this.countryData.showAllCountryData().subscribe((data:any)=>{
    this.loaderApi.hide()
    this.allCD=data
    this.countries=this.allCD
    console.log(this.allCD)
  })
}
handleMouseWheel(event: WheelEvent) {
  const carousel = event.currentTarget as HTMLElement;
  const delta = Math.sign(event.deltaY);

  if (delta > 0) {
    setTimeout(() => {
      carousel.scrollLeft += carousel.clientWidth/4.5;
    }, 200);

  } else if (delta < 0) {
    setTimeout(() => {
      carousel.scrollLeft -= carousel.clientWidth/4.5;
    }, 200);
  }
  event.preventDefault();
}
}
