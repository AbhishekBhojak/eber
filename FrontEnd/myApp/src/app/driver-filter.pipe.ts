import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'driverFilter'
})
export class DriverFilterPipe implements PipeTransform {

  transform(value: any, driverQuery:string )  {
    if(driverQuery==""){
      return value;
    }
    const drivers=[]
    for(const driver of value){
      if(driver['driverName'].toLowerCase().includes(driverQuery.toLowerCase())){
        drivers.push(driver)
      }
      else if(driver['driverEmail'].toLowerCase().includes(driverQuery.toLowerCase())){
        drivers.push(driver)
      }
      else if(driver['driverPhone'].toLowerCase().includes(driverQuery.toLowerCase())){
        drivers.push(driver)
      }
      else if(driver['countryId'].countryName.toLowerCase().includes(driverQuery.toLowerCase())){
        drivers.push(driver)
      }
      else if(driver['cityId'].cityName.toLowerCase().includes(driverQuery.toLowerCase())){
        drivers.push(driver)
      }
      else if(driver['vehicleTypeId'].vehicleName.toLowerCase().includes(driverQuery.toLowerCase())){
        drivers.push(driver)
      }
    }
    return drivers
  }

}
