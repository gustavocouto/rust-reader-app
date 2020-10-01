import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { ContextService } from 'src/app/services/context.service';
import { IIngredientRead } from 'src/app/interfaces/IIngredientRead';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit {
  label_name: string = ''
  scanning: boolean = false
  scanned_file: File = null
  scanned_file_base64: string = null
  ingredient_reads: IIngredientRead[] = []

  constructor(
    private _camera: Camera,
    private _apiService: ApiService
  ) {
    _apiService
      .readImageFile(`${window.location.origin}/assets/images/rotulo.jpg`, 'image.jpg', 'image/jpeg')
      .subscribe(file => this.setScan(file))
  }

  async capture() {
  }

  async base64ToFile(base64, filename, mimeType) {
    return await fetch(`data:text/plain;base64,${base64}`)
      .then(res => res.arrayBuffer())
      .then(buffer => new File([buffer], filename, { type: mimeType }))
  }

  async ngOnInit() {
    
  }

  save() {
    if(!this.scanned_file || !this.ingredient_reads.length)
      return

    this._apiService
      .addLabel({name: this.label_name, ingredients: this.ingredient_reads})
      .subscribe(() => {})
  }

  async setScan(file: File) {
    this.scanning = true
    this.scanned_file = file
    const reader = new FileReader()
    reader.readAsDataURL(this.scanned_file)
    reader.onload = () => this.scanned_file_base64 = (reader.result as string)

    const reads = await this._apiService.readImage(file).toPromise()
    this.scanned_file && (this.ingredient_reads = reads)
    this.scanning = false
  }

  clearScan() {
    this.scanning = false
    this.scanned_file = null
    this.scanned_file_base64 = null
    this.ingredient_reads = []
  }
}