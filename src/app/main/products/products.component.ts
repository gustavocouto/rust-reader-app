import { LabelService } from '../../services/label.service';
import { Component, OnInit } from '@angular/core';
import { Label } from 'src/app/models/Label';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  labels: Label[] = []
  strict: 'all' | 'me' = 'me'
  search: string
  products: any[] = [{name: 'product1'}, {name: 'product2'}]

  constructor(private _labelService: LabelService) {

  }

  ngOnInit() {
    this.filter()
  }

  filter() {
    this._labelService
      .getLabels(this.strict, this.search)
      .subscribe(labels => this.labels = labels)
  }

  changeStrict(strict) {
    this.strict = strict
    this.filter()
  }
}