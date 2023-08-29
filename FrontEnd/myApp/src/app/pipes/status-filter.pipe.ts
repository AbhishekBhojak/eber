import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFilter'
})
export class StatusFilterPipe implements PipeTransform {

  transform(value: String): any {
if (value =='pending') {
  return 'Accept';
}
else if(value == 'accepted'){
  return 'Arrive';
}    
else if(value == 'arrived'){
  return 'Pick Up';
}    
else if(value == 'picked'){
  return 'Start'
}    
else if(value == 'started'){
  return 'End Ride'
}else{

  return null;
}    
  }
}
