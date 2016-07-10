import {Component} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, CanActivate} from '@angular/router-deprecated';

@Component({
    selector: 'respond-edit',
    templateUrl: './app/edit/edit.component.html',
    providers: [],
    directives: [],
    pipes: []
})

@CanActivate(() => tokenNotExpired())

export class EditComponent {

  constructor (private _router: Router) {}

  /**
   * Init pages
   *
   */
  ngOnInit() {

    var id, pageUrl;
    
    id = localStorage.getItem('respond.siteId');
    pageUrl = localStorage.getItem('respond.pageUrl');
    this.url = '/edit?q=' + id + '/' + pageUrl;

  }

}