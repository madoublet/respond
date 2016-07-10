import {Injectable}     from '@angular/core'
import {Http, Response} from '@angular/http'
import {AuthHttp, AuthConfig} from 'angular2-jwt/angular2-jwt';
import {Headers, RequestOptions} from '@angular/http'
import {Observable} from 'rxjs/Observable'

@Injectable()
export class MenuService {
  constructor (private http: Http, private authHttp: AuthHttp, private authConfig: AuthConfig) {}

  private _listUrl = 'api/menus/list';
  private _listItemsUrl = 'api/menus/items/list';
  private _addUrl = 'api/menus/add';
  private _editUrl = 'api/menus/edit';
  private _removeUrl = 'api/menus/remove';

  /**
   * Lists menus
   *
   */
  list () {
    return this.authHttp.get(this._listUrl).map((res:Response) => res.json());
  }

  /**
   * Adds a menu
   *
   * @param {string} name
   * @return {Observable}
   */
  add (name: string) {

    let body = JSON.stringify({ name });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this._addUrl, body, options);

  }

  /**
   * Edits a menu
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
   * Removes a menu
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