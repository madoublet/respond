import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FormFieldService {
  constructor (private http: Http) {}

  private _listUrl = 'api/forms/fields/list';
  private _addUrl = 'api/forms/fields/add';
  private _editUrl = 'api/forms/fields/edit';
  private _removeUrl = 'api/forms/fields/remove';
  private _updateOrderUrl = 'api/forms/fields/order';

  /**
   * Lists fields
   *
   */
  list (id) {

    let url = this._listUrl + '/' + encodeURI(id);
    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options).map((res:Response) => res.json());
  }

  /**
   * Adds a form filed
   *
   * @param {string} label
   * @param {string} type
   * @param {boolean} required
   * @param {string} options
   * @param {string} helperText
   * @param {string} placeholder
   * @param {string} cssClass
   * @return {Observable}
   */
  add (id: string, label: string, type: string, required: boolean, options: string, helperText: string, placeholder: string, cssClass: string) {

    let body = JSON.stringify({ id, label, type, required, options, helperText, placeholder, cssClass });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let _options = new RequestOptions({ headers: headers });

    return this.http.post(this._addUrl, body, _options);

  }

  /**
   * Edits a form field
   *
   * @param {string} id
   * @param {number} index
   * @param {string} label
   * @param {string} type
   * @param {boolean} required
   * @param {string} options
   * @param {string} helperText
   * @param {string} placeholder
   * @param {string} cssClass
   * @return {Observable}
   */
  edit (id: string, index: number, label: string, type: string, required: boolean, options: string, helperText: string, placeholder: string, cssClass: string) {

    let body = JSON.stringify({ id, index, label, type, required, options, helperText, placeholder, cssClass });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let _options = new RequestOptions({ headers: headers });

    return this.http.post(this._editUrl, body, _options);

  }

  /**
   * Removes a form field
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
   * Updates the order of fields
   *
   * @param {string} name
   * @param {string} priority
   * @return {Observable}
   */
  updateOrder (id, fields) {

    let body = JSON.stringify({ id, fields });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._updateOrderUrl, body, options);

  }

}