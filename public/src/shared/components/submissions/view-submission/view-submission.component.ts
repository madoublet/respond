import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubmissionService } from '../../../../shared/services/submission.service';

declare var __moduleName: string;
declare var toast: any;

@Component({
    selector: 'respond-view-submission',
    templateUrl: 'view-submission.component.html',
    providers: [SubmissionService]
})

export class ViewSubmissionComponent {

  routes;

  // model to store
  model: {
    id: '',
    name: '',
    formId: ''
  };

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  @Input()
  set submission(submission){

    // set visible
    this.model = submission;

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _submissionService: SubmissionService) {}

  /**
   * Init
   */
  ngOnInit() {

  }

  /**
   * Hides the modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }


}