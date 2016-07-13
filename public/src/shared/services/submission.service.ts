import {Injectable}     from '@angular/core'
import {Http, Response} from '@angular/http'
import {AuthHttp, AuthConfig} from 'angular2-jwt/angular2-jwt';
import {Headers, RequestOptions} from '@angular/http'
import {Observable} from 'rxjs/Observable'

@Injectable()
export class SubmissionService {
  constructor (private http: Http, private authHttp: AuthHttp, private authConfig: AuthConfig) {}

  private _listUrl = 'api/submissions/list';
  private _removeUrl = 'api/submissions/remove';

  /**
   * Lists submissions in the application
   *
   */
  list () {

    return this.authHttp.get(this._listUrl).map((res:Response) => res.json());

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
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this._removeUrl, body, options);

  }

}