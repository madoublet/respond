import {Injectable}     from '@angular/core'
import {Http, Response} from '@angular/http'
import {AuthHttp, AuthConfig} from 'angular2-jwt/angular2-jwt';
import {Headers, RequestOptions} from '@angular/http'
import {Observable} from 'rxjs/Observable'

@Injectable()
export class RouteService {
  constructor (private http: Http, private authHttp: AuthHttp, private authConfig: AuthConfig) {}

  private _listUrl = 'api/routes/list';

  /**
   * Lists pages in the application
   *
   */
  list () {

    // LOOK AT BUG HERE: https://github.com/auth0/angular2-jwt/issues/28

    return this.authHttp.get(this._listUrl).map((res:Response) => res.json());

  }

}