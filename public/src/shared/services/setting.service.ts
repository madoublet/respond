import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SettingService {
  constructor (private http: Http) {}

  private _listUrl = 'api/settings/list';
  private _editUrl = 'api/settings/edit';

  /**
   * Lists settings
   *
   */
  list () {

    var url = this._listUrl;

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options).map((res:Response) => res.json());
  }

  /**
   * Editssettings
   *
   * @param {array} settings
   * @return {Observable}
   */
  edit (settings) {

    let body = JSON.stringify({ settings });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._editUrl, body, options);

  }


}