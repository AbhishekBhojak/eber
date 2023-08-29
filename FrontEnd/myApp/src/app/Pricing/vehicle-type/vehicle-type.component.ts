import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { LoginApiService } from 'src/app/services/login-api.service';
import { SessionService } from 'src/app/services/session.service';
import {VehicleTypeApiService} from 'src/app/services/vehicle-type-api.service'
@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css']
})
export class VehicleTypeComponent {
  vehicleName:any=""
  vehicleImage:any=""
  editing:boolean = false
  editable:boolean=false
  isNameEmpty:boolean=false
  fileSizeError = false;
  file:any
  isImageEmpty:boolean=false
  vehicleTypeData:any
  selectedData:any
  notImage:boolean=false
  updateData:any
  isImage:boolean=false
  onFileSelected(event: any) {
    var input = event.target;
    this.file=input.files[0]
    var type=this.file.type.split('/')[0]
    console.log(type)
    if(type=="image"){
      this.notImage=false
      this.isImageEmpty=false
    this.isImage=true
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function(e:any) {
        var previewImage:any = document.getElementById('previewImage');
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
      }
      reader.readAsDataURL(input.files[0]);
    }
    if (this.file && this.getFileSizeInMB(this.file.size) >1) { // Check if file size exceeds 1MB (adjust the size limit as needed)
    this.loginApi.showMessage({message:"File size exceeded",color:'orange'});
    this.file=undefined
    } 
  }else{
    this.file=undefined
    this.notImage=true
    this.loginApi.showMessage({message:'only image are allowed',color:'orange'});
    this.isImage=false
  }
  }
  getFileSizeInMB(fileSize: number): number {
    return fileSize / (1024 * 1024);
  }
  ngOnInit(): void {
    this.loaderApi.show()
   this.getVehicleType()
  //  this.fetchvehicleType()

  }
constructor(private vehicleApi:VehicleTypeApiService,private sessionApi:SessionService,private loginApi:LoginApiService,private loaderApi:LoaderService){}

storeVehicleType(){
  this.isImage=false
  const index=this.vehicleTypeData.findIndex((object:any)=>  object.vehicleName.toLowerCase() ===this.vehicleName.toLowerCase())
  this.validation()
  if(this.file){
    if(index==-1){
    var data= new FormData()
    data.append('name',this.vehicleName)
    data.append('vehicleImage',this.file)
    this.loaderApi.show()
    this.vehicleApi.storeVehicleType(data).subscribe((data:any)=>{
        this.loaderApi.hide()
      this.loginApi.showMessage({message:'vehicle Added successfully',bool:true})
      this.getVehicleType()
      this.vehicleName=""
      this.file=undefined
      console.log(this.file)
    })  
}else{
  this.file=undefined
this.loginApi.showMessage({message:'car already exists'}) 
  }

}
else{
  this.loginApi.showMessage({message:'pls upload file',color:'black'})
}
}
checkName(){
  if(this.vehicleName){
    this.isNameEmpty=false
  }
}
validation(){
  if(this.vehicleName==''){
    this.isNameEmpty=true
  }else{
    this.isNameEmpty=false
  }
  if(!this.file){
    this.isImageEmpty=true
  }else{
    this.isImageEmpty=false
  }
}
getVehicleType(){
  this.vehicleApi.getVehicleType().subscribe((data:any)=>{
    this.loaderApi.hide()
    this.vehicleTypeData=data
  })
}

editButtonClick(data:any){
  this.isImage=false
  this.file=undefined
  this.selectedData=data;
  this.vehicleName=this.selectedData.vehicleName;
  this.editing=true
}
onCancel(){
  this.editing=false
  this.vehicleName=''
  this.isImage=false
}
updateVehicleType(){
  var index
  if(this.vehicleName.toLowerCase()== this.selectedData.vehicleName.toLowerCase()){
    index=-1
    console.log('inif');
    if(!this.file && this.vehicleName==this.selectedData.vehicleName){
      this.loginApi.showMessage({message:'No data updated'})
      return
    }
    
    
  }
  else{
    console.log('inelse');
    index=this.vehicleTypeData.findIndex((object:any)=>  object.vehicleName.toLowerCase() ===this.vehicleName.toLowerCase());
  }
  if(index==-1){ 
  var data = new FormData()
  if(this.vehicleName){
    data.append('vehicleName',this.vehicleName)
  }
  if(this.file){
    data.append('image',this.file)
  }
  data.append('_id',this.selectedData._id)
  this.loaderApi.show()
  this.vehicleApi.updateVehicleType(data).subscribe((data:any)=>{
    this.isImage=false
    this.loaderApi.show()
    this.loginApi.showMessage({message:'updated vehicle type',bool:true})
    this.getVehicleType()
    console.log(data) 
    this.vehicleName='edit btn clicked'
    this.editing=false
    this.vehicleName=''
    this.file=undefined
    // console.log('edit buttun clicked')
    
  }) 
}else{
this.loginApi.showMessage({message:'car already exists'})
}
}
handleMouseWheel(event: WheelEvent) {
  const carousel = event.currentTarget as HTMLElement;
  
  const delta = Math.sign(event.deltaY);
  if (delta > 0) {
    // Scrolling down, move to the next item
   setTimeout(() => {
    carousel.scrollLeft += carousel.clientWidth/1.5;
   }, 200);
  } else if (delta < 0) {
    // Scrolling up, move to the previous item
    setTimeout(() => {
    carousel.scrollLeft -= carousel.clientWidth/1.5;
    }, 200);
  }
  event.preventDefault();
}
}
