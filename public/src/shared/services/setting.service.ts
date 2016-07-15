import {Injectable}     from '@angular/core'
import {Http, Response} from '@angular/http'
import {AuthHttp, AuthConfig} from 'angular2-jwt/angular2-jwt';
import {Headers, RequestOptions} from '@angular/http'
import {Observable} from 'rxjs/Observable'

@Injectable()
export class SettingService {
  constructor (private http: Http, private authHttp: AuthHttp, private authConfig: AuthConfig) {}

  private _listUrl = 'api/settings/list';
  private _editUrl = 'api/settings/edit';

  /**
   * Lists settings
   *
   */
  list () {

    var url = this._listUrl;

    return this.authHttp.get(url).map((res:Response) => res.json());
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
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this._editUrl, body, options);

  }


}