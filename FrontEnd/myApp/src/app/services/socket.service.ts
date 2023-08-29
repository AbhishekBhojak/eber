import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket:any
  constructor() { 
  }
  setSocket(data:any){
    this.socket=data
  }
  getSocket() {
    return this.socket
  }
}
