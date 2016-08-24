import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RouteService {
  constructor (private http: Http) {}

  private _listUrl = 'api/routes/list';

  /**
   * Lists pages in the application
   *
   */
  list () {

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._listUrl, options).map((res:Response) => res.json());

  }

}