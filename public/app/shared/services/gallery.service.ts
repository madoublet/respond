import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt/angular2-jwt';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GalleryService {
  constructor (private http: Http, private authHttp: AuthHttp, private authConfig: AuthConfig) {}

  private _listUrl = 'api/galleries/list';
  private _addUrl = 'api/galleries/add';
  private _editUrl = 'api/galleries/edit';
  private _removeUrl = 'api/galleries/remove';

  /**
   * Lists forms
   *
   */
  list () {
    return this.authHttp.get(this._listUrl).map((res:Response) => res.json());
  }

  /**
   * Adds a gallery
   *
   * @param {string} name
   * @param {string} cssClass
   * @return {Observable}
   */
  add (name: string) {

    let body = JSON.stringify({ name });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this._addUrl, body, options);

  }

  /**
   * Edits a gallery
   *
   * @param {string} name
   * @return {Observable}
   */
  edit (id: string, name: string) {

    let body = JSON.stringify({ id, name });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this._editUrl, body, options);

  }

  /**
   * Removes a gallery
   *
   * @param {string} id
   * @return {Observable}
   */
  remove (id: string) {

    let body = JSON.stringify({ id });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this._removeUrl, body, options);

  }

}