import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileService {
  constructor (private http: Http) {}

  private _listUrl = 'api/files/list';
  private _removeFileUrl = 'api/files/remove';

  /**
   * Lists files in the application
   *
   */
  list () {

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._listUrl, options).map((res:Response) => res.json());

  }

  /**
   * Removes the file
   *
   * @param {string} name
   * @return {Observable}
   */
  remove (name: string) {

    let body = JSON.stringify({ name });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._removeFileUrl, body, options);

  }

}