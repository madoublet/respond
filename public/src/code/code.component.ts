import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CodeService } from '../shared/services/code.service';

declare var toast: any;
declare var ace: any;

@Component({
    selector: 'respond-code',
    templateUrl: 'code.component.html',
    providers: [CodeService],
})

export class CodeComponent {

  private id: string;
  private code: string;
  private codeUrl: string;
  private codeType: string = 'not-specified';
  private editor: any;
  private pages: any;
  private templates: any;
  private stylesheets: any;
  private scripts: any;
  private plugins: any;
  private components: any;
  private showMenu: boolean;
  private isPagesExpanded: boolean;
  private isTemplatesExpanded: boolean;
  private isStylesheetsExpanded: boolean;
  private isScriptsExpanded: boolean;
  private isPluginsExpanded: boolean;
  private isComponentsExpanded: boolean;
  addVisible: boolean = false;

  constructor (private _route: ActivatedRoute, private _router: Router, private _codeService: CodeService) {}

  /**
   * init
   */
  ngOnInit() {

    var id, codeUrl;

    id = localStorage.getItem('respond.siteId');

    this.codeUrl = localStorage.getItem('respond.codeUrl');
    this.codeType = localStorage.getItem('respond.codeType');
    this.showMenu = true;
    this.addVisible = false;

    // get types
    this.pages = [];
    this.templates = [];
    this.stylesheets = [];
    this.scripts = [];
    this.plugins = [];
    this.components = [];

    // set expanded
    this.isPagesExpanded = false;
    this.isTemplatesExpanded = false;
    this.isStylesheetsExpanded = false;
    this.isScriptsExpanded = false;
    this.isPluginsExpanded = false;
    this.isComponentsExpanded = false;

    if(this.codeType == 'page' || this.codeType == 'component') {
      this.showMenu = false;
    }
    else {
      this.list();
    }

    this.retrieve();
    this.setExpanded();

  }

  /**
   * determines which area is expanded by default
   */
  setExpanded() {

    if(this.codeType == 'page') {
      this.isPagesExpanded = true;
    }
    else if(this.codeType == 'template') {
      this.isTemplatesExpanded = true;
    }
    else if(this.codeType == 'stylesheet') {
      this.isStylesheetsExpanded = true;
    }
    else if(this.codeType == 'script') {
      this.isScriptsExpanded = true;
    }
    else if(this.codeType == 'plugin') {
      this.isPluginsExpanded = true;
    }
    else if(this.codeType == 'component') {
      this.isComponentsExpanded = true;
    }

  }

   /**
   * determines which area is expanded by default
   */
  expand(codeType: string) {

    if(codeType == 'page') {
      this.isPagesExpanded = !this.isPagesExpanded;
    }
    else if(codeType == 'template') {
      this.isTemplatesExpanded = !this.isTemplatesExpanded;
    }
    else if(codeType == 'stylesheet') {
      this.isStylesheetsExpanded = !this.isStylesheetsExpanded;
    }
    else if(codeType == 'script') {
      this.isScriptsExpanded = !this.isScriptsExpanded;
    }
    else if(codeType == 'plugin') {
      this.isPluginsExpanded = !this.isPluginsExpanded;
    }
    else if(codeType == 'component') {
      this.isComponentsExpanded = !this.isComponentsExpanded;
    }

  }

  /**
   * Resets modal booleans
   */
  reset() {
    this.addVisible = false;
  }

  /**
   * navigates back
   */
   back() {

     history.go(-1);

   }

  /**
   * Updates the list
   */
  retrieve() {

    this._codeService.retrieve(this.codeUrl, this.codeType)
                     .subscribe(
                       data => { this.setupEditor(data); },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * Views a code block
   */
  view(type, url) {
    this.codeType = type;
    this.codeUrl = url;
    this.retrieve();
  }

  /**
   * Updates the list
   */
  list() {

    this.reset();

    this._codeService.list('page')
                     .subscribe(
                       data => { this.pages = data; },
                       error =>  { this.failure(<any>error); }
                      );

    this._codeService.list('template')
                     .subscribe(
                       data => { this.templates = data; },
                       error =>  { this.failure(<any>error); }
                      );

    this._codeService.list('stylesheet')
                     .subscribe(
                       data => { this.stylesheets = data; },
                       error =>  { this.failure(<any>error); }
                      );

    this._codeService.list('script')
                     .subscribe(
                       data => { this.scripts = data; },
                       error =>  { this.failure(<any>error); }
                      );

    this._codeService.list('plugin')
                     .subscribe(
                       data => { this.plugins = data; },
                       error =>  { this.failure(<any>error); }
                      );

    this._codeService.list('component')
                     .subscribe(
                       data => { this.components = data; },
                       error =>  { this.failure(<any>error); }
                      );
  }

  /**
   * setup the ace editor
   */
  setupEditor(data) {

    this.editor = ace.edit("editor");

    if(this.codeType == "page") {
       this.editor.getSession().setMode("ace/mode/html");
    }
    else if(this.codeType == "stylesheet") {
       this.editor.getSession().setMode("ace/mode/css");
    }
    else if(this.codeType == "script") {
       this.editor.getSession().setMode("ace/mode/javascript");
    }
    else if(this.codeType == "plugin") {
       this.editor.getSession().setMode("ace/mode/php");
    }
    else {
       this.editor.getSession().setMode("ace/mode/html");
    }

    this.editor.setValue(data);
    this.editor.setTheme("ace/theme/chrome");
    this.editor.blur();
    this.editor.session.selection.clearSelection();

  }

  /**
   * handles error
   */
  failure(obj) {

    toast.show('failure');

    if(obj.status == 401) {
    //  this._router.navigate( ['/login', this.id] );
    }

  }

  /**
   * Handles a successful save
   */
  success() {

    toast.show('success');

  }

  /**
   * Save the code
   */
  save() {

    // save code from the editor
    this._codeService.save(this.editor.getValue(), this.codeUrl, this.codeType)
                     .subscribe(
                       data => { this.success(); this.list(); },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * Save the code and go back
   */
  saveAndExit() {

    // save code from the editor
    this._codeService.save(this.editor.getValue(), this.codeUrl, this.codeType)
                     .subscribe(
                       data => { this.success(); history.go(-1); },
                       error =>  { this.failure(<any>error); }
                      );


  }

  /**
   * Shows the add dialog
   */
  showAdd() {
    this.addVisible = true;
  }

}