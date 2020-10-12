import { Component, OnDestroy, OnInit } from '@angular/core';
import { Camera, CameraOptions, DestinationType, EncodingType, MediaType } from '@ionic-native/camera/ngx';
import { IIngredientRead } from 'src/app/interfaces/IIngredientRead';
import { ApiService } from 'src/app/services/api.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { ToastController } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent {
  label_name: string = ''
  scanning: boolean = false
  scanned_file: File = null
  scanned_file_base64: string = null
  ingredient_reads: IIngredientRead[] = []

  constructor(
    private _camera: Camera,
    private _apiService: ApiService,
    private _ingredientService: IngredientService,
    private _toastController: ToastController,
    private _backgroundMode: BackgroundMode) {
    // _apiService
    //   .readImageFile(`${window.location.origin}/assets/images/rotulo.jpg`, 'image.jpg', 'image/jpeg')
    //   .subscribe(file => this.setScan(file))
  }

  async capture(sourceType: number) {
    const options: CameraOptions = {
      allowEdit: true,
      destinationType: DestinationType.DATA_URL,
      encodingType: EncodingType.JPEG,
      saveToPhotoAlbum: false,
      mediaType: MediaType.PICTURE,
      sourceType: sourceType,
      quality: 100
    }

    this._backgroundMode.enable()
    const base64 = await this._camera.getPicture(options)
    const file = await this.base64ToFile(base64, 'label.jps', 'image/jpeg')
    this._backgroundMode.disable()

    await this.setScan(file)
  }

  async base64ToFile(base64, filename, mimeType) {
    return await fetch(`data:text/plain;base64,${base64}`)
      .then(res => res.arrayBuffer())
      .then(buffer => new File([buffer], filename, { type: mimeType }))
  }

  async save() {
    if(!this.scanned_file || !this.ingredient_reads.length)
      return

    await this._apiService.addLabel({name: this.label_name, ingredients: this.ingredient_reads}).toPromise()
    this.clearScan()

    const toast = await this._toastController.create({
      message: 'Informações do rótulo salvas.',
      duration: 4000
    })

    toast.present()
  }

  async setScan(file: File) {
    this.scanning = true
    this.scanned_file = file
    const reader = new FileReader()
    reader.readAsDataURL(this.scanned_file)
    reader.onload = () => this.scanned_file_base64 = (reader.result as string)

    const text = await this._apiService.readImageAsText(file).toPromise()
    if(this.scanned_file)
      this.ingredient_reads = await this._ingredientService.findIngredientsMatches(text)
    
    this.scanning = false
  }

  clearScan() {
    this.scanning = false
    this.scanned_file = null
    this.scanned_file_base64 = null
    this.ingredient_reads = []
  }
}