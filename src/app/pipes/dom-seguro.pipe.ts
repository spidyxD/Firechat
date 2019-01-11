import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer  } from '@angular/platform-browser';


@Pipe({
  name: 'domSeguro'
})
export class DomseguroPipe implements PipeTransform {

  constructor( private domSanitizer: DomSanitizer ) { }

  transform( value: string, provider: string): any {
    const url = 'https://pbs.twimg.com/profile_images/';
    console.log(value , provider);
    if (provider === 'twiter') {
      return this.domSanitizer.bypassSecurityTrustResourceUrl( url + value.slice(37) );
    }
    return value;
  }

}
