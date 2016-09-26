import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MenuItemService {
  constructor (private http: Http) {}

  private _listUrl = 'api/menus/items/list';
  private _addUrl = 'api/menus/items/add';
  private _editUrl = 'api/menus/items/edit';
  private _removeUrl = 'api/menus/items/remove';
  private _updateOrderUrl = 'api/menus/items/order';

  /**
   * Lists items
   *
   */
  list (id) {

    var url = this._listUrl + '/' + encodeURI(id);

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options).map((res:Response) => res.json());
  }

  /**
   * Adds a menu item
   *
   * @param {string} id
   * @param {string} html
   * @param {string} cssClass
   * @param {string} isNested
   * @param {string} priority
   * @param {string} url
   * @return {Observable}
   */
  add (id: string, html: string, cssClass: string, isNested: boolean, url: string, target: string) {

    let body = JSON.stringify({ id, html, cssClass, isNested, url, target });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._addUrl, body, options);

  }

  /**
   * Edits a menu item
   *
   * @param {string} id
   * @param {string} index
   * @param {string} html
   * @param {string} cssClass
   * @param {string} isNested
   * @param {string} priority
   * @param {string} url
   * @return {Observable}
   */
  edit (id: string, index: number, html: string, cssClass: string, isNested: boolean, url: string, target: string) {

    let body = JSON.stringify({ id, index, html, cssClass, isNested, url, target });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._editUrl, body, options);

  }

  /**
   * Removes a menu item
   *
   * @param {string} name
   * @param {string} index
   * @return {Observable}
   */
  remove (id: string, index: number) {

    let body = JSON.stringify({ id, index });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._removeUrl, body, options);

  }

  /**
   * Updates the order of a list
   *
   * @param {string} name
   * @param {string} priority
   * @return {Observable}
   */
  updateOrder (id, items) {

    let body = JSON.stringify({ id, items });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._updateOrderUrl, body, options);

  }

}