import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'placeHolder',
})
export class PlaceHolderPipe implements PipeTransform {
  
  transform(value: string, defecto: string) {

    return (value) ? value : defecto;
    
  }
}
