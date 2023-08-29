import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterPipe'
})
export class FilterPipePipe implements PipeTransform {
  
  transform(value: any, queryData: string) {
    if(value.lenght==0){
      return value;
    }
    const users=[]
    for(const user of value){
      if(user['countryName'].toLowerCase().includes(queryData.toLowerCase())){
        users.push(user);
      }
    }
    return users;
  }
//   transform(value:any,queryCity:string){
//     if(value.length==0){
//       return value;                                                                                                                                                                                                
//     }
//     const city=[]
//     for(const cities of value){
//       if(cities['countryName'].toLowerCase().includes(queryCity.toLowerCase())){
//         city.push(cities)
//     }
//     return city
//   }
// }
}