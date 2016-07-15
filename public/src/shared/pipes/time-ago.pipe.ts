import {Pipe, PipeTransform} from '@angular/core';

declare var moment: any;

@Pipe({name: 'timeAgo'})
export class TimeAgoPipe implements PipeTransform {
  transform(value:string, str:string[]) : any {

    // set locale
    if(str) {
      moment.locale(str);
    }
    else {
      moment.locale('en');
    }

    return moment(value).fromNow();

  }
}