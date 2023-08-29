import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(value: any, userData: string) {
  if(userData==''){
    return value
  }
  const users=[]
  for(const user of value){
    if(user['userName'].toLowerCase().includes(userData.toLowerCase())){
      users.push(user)
    }
    else if(user['userEmail'].toLowerCase().includes(userData.toLowerCase())){
      users.push(user)
    }
    else if(user['userPhone'].toLowerCase().includes(userData.toLowerCase())){
      users.push(user)
    }
    else if(user['countryId']['countryName'].toLowerCase().includes(userData.toLowerCase())){
      users.push(user)
    }
  }
  return users
  }
}
