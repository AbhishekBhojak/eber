import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'confirmRidesFilter'
})
export class ConfirmRidesPipe implements PipeTransform {

  transform(value: any, confirmData:any) {
    if(confirmData==''){
      return value
    }
    const ridesData=[]
    for(const ride of value){
      if(ride['currentStatus'].toLowerCase().includes(confirmData.toLowerCase())){
        ridesData.push(ride)
      }
      else if(ride['userId'].userName.toLowerCase().includes(confirmData.toLowerCase())){
        ridesData.push(ride)
      
      }else if(ride['serviceId'].vehicleName.toLowerCase().includes(confirmData.toLowerCase())){
        ridesData.push(ride)
      }else if(ride['userId'].userPhone.toLowerCase().includes(confirmData.toLowerCase())){
        ridesData.push(ride)
      }else if(ride['date'].toLowerCase().includes(confirmData.toLowerCase())){
        ridesData.push(ride)
      }
    }
    return ridesData
  }

}
