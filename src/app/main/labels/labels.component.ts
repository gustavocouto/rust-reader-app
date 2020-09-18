import { Component, OnInit } from '@angular/core';
import { ILabel } from 'src/app/interfaces/ILabel';
import { ContextService } from 'src/app/services/context.service';
import { IUser } from 'src/app/interfaces/IUser';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
})
export class LabelsComponent implements OnInit {
  strict: 'all' | 'me' = 'me'
  search: string
  labels: ILabel[]

  constructor(private _apiService: ApiService,
    private _contextService: ContextService) {

  }

  ngOnInit() {
    this.filter()
  }

  filter() {
    // this._labelService
    //   .getLabels(this.strict)
    //   .subscribe(labels => this.labels = labels)
  
  }

  changeStrict(strict) {
    this.strict = strict
    this.filter()
  }
}