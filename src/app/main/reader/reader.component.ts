import { Component, OnInit, ViewChild, ContentChild, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit {
  scanElements: any[] = [
  ]
  
  constructor(private _camera: Camera) { }

  async capture() {
    const picture = await this._camera.getPicture({
      quality: 100,
      allowEdit: false,
      cameraDirection: this._camera.Direction.BACK,
      destinationType: this._camera.DestinationType.DATA_URL,
      mediaType: this._camera.MediaType.PICTURE,
      sourceType: this._camera.PictureSourceType.PHOTOLIBRARY
    })
  }

  ngOnInit() {
  }
}
