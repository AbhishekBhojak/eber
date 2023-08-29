import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cityFilter'
})
export class CityFilterPipe implements PipeTransform {

  transform(value: any, queryData:any) {
    if(value.lenght==0){
      return value;
    }
    var cities=[]
    for(const city of value){
      if(city['countryId']===queryData){
        cities.push(city);
      }
    }
    return cities;
  }

}
