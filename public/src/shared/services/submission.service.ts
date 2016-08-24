import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SubmissionService {
  constructor (private http: Http) {}

  private _listUrl = 'api/submissions/list';
  private _removeUrl = 'api/submissions/remove';

  /**
   * Lists submissions in the application
   *
   */
  list () {

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._listUrl, options).map((res:Response) => res.json());

  }

  /**
   * Removes the submission
   *
   * @param {string} url
   * @return {Observable}
   */
  remove (id: string) {

    let body = JSON.stringify({ id });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._removeUrl, body, options);

  }

}