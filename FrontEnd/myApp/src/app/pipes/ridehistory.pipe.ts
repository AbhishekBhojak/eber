import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ridehistory'
})
export class RidehistoryPipe implements PipeTransform {

  transform(value: any,ridehistoy:any ) {
    if(ridehistoy==''){
      return value
    }
    const rideData=[]
    for(const data of value){
      if(data['pickUp'].toLowerCase().includes(ridehistoy.toLowerCase())){
        rideData.push(data)
      }
      else if(data['drop'].toLowerCase().includes(ridehistoy.toLowerCase())){
      rideData.push(data)
    }
      else if(data['currentStatus'].toLowerCase().includes(ridehistoy.toLowerCase())){
      rideData.push(data)
    }
    if(data['userId']!=null && data['userId']!=undefined){
    if(data['userId'].userName.toLowerCase().includes(ridehistoy.toLowerCase())){
      rideData.push(data)
    }
  }
    if(data['userId']!=null && data['userId']!=undefined){
     if(data['userId'].userPhone.toLowerCase().includes(ridehistoy.toLowerCase())){
      rideData.push(data)
    }
  }
    // }else{
    if(data['driverId']!=null && data['driverId']!=undefined){
      if(data['driverId'].driverName.toLowerCase().includes(ridehistoy.toLowerCase())){   
        rideData.push(data)
      }
    }
    if(data['driverId']!=null && data['driverId']!=undefined){
      if(data['driverId'].driverPhone.toLowerCase().includes(ridehistoy.toLowerCase())){
        rideData.push(data)
      }
    }
  }
    return rideData
  }

}
