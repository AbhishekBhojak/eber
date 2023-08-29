import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'driver'
})
export class DriverPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
