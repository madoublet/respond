import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ComponentService {
  constructor (private http: Http) {}

  private _listUrl = 'api/components/list';
  private _addUrl = 'api/components/add';
  private _removeUrl = 'api/components/remove';

  /**
   * Lists components
   *
   */
  list () {
    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._listUrl, options).map((res:Response) => res.json());
  }

  /**
   * Adds a component
   *
   * @param {string} url
   * @return {Observable}
   */
  add (url: string) {

    let body = JSON.stringify({ url });

    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._addUrl, body, options);

  }

  /**
   * Removes the component
   *
   * @param {string} url
   * @return {Observable}
   */
  remove (url: string) {

    let body = JSON.stringify({ url });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._removeUrl, body, options);

  }

}