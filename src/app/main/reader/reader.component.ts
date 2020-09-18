import { Component, OnInit, ViewChild, ContentChild, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ICompound } from 'src/app/interfaces/ICompound';
import { ContextService } from 'src/app/services/context.service';
import { IUser } from 'src/app/interfaces/IUser';
import { ICompoundRead } from 'src/app/interfaces/ICompoundRead';
import { ApiService } from 'src/app/services/api.service';
import { settings } from 'cluster';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit {
  user: IUser
  label_name: string = ''
  scanning: boolean = false
  scanned_file: File = null
  scanned_file_base64: string = null
  compound_reads: ICompoundRead[] = []

  constructor(
    private _camera: Camera,
    private _contextService: ContextService,
    private _apiService: ApiService
  ) {
    _apiService
      .readImageFile(`${window.location.origin}/assets/images/rotulo.jpg`, 'image.jpg', 'image/jpeg')
      .subscribe(file => this.setScan(file))
  }

  async capture() {
    const picture = await this._camera.getPicture({
      quality: 100,
      allowEdit: false,
      cameraDirection: this._camera.Direction.BACK,
      destinationType: this._camera.DestinationType.FILE_URI,
      mediaType: this._camera.MediaType.PICTURE,
      encodingType: this._camera.EncodingType.JPEG,
      sourceType: this._camera.PictureSourceType.PHOTOLIBRARY
    })
  }

  async base64ToFile(base64, filename, mimeType) {
    return await fetch(`data:text/plain;base64,${base64}`)
      .then(res => res.arrayBuffer())
      .then(buffer => new File([buffer], filename, { type: mimeType }))
  }

  async ngOnInit() {
    this.user = await this._contextService.storage.getUser()
  }

  getSortedCompounds() {
    return this.compound_reads
      .sort((left, right) => {
        return left.accuracy > right.accuracy ? -1 : 1
      })
      .sort((left, right) => {
        if (!this.user || this.user.priority_allergenics)
          return 0

        const leftPriority = this.user.priority_allergenics.some(_ => _.id == left.best_match.id)
        const rightPriority = this.user.priority_allergenics.some(_ => _.id == right.best_match.id)
        if (leftPriority && !rightPriority) return -1
        if (!leftPriority && rightPriority) return 1
        if (leftPriority && rightPriority) return 0
        else return 0
      })
  }

  isPriorityAllergenic(name: string) {
    if (!this.user || !this.user.priority_allergenics)
      return false

    return this.user.priority_allergenics.some(_ => _.name == name)
  }

  save() {
    if(!this.scanned_file || !this.compound_reads.length)
      return

    this._apiService
      .addLabel({name: this.label_name, compounds: this.compound_reads})
      .subscribe(() => {})
  }

  async setScan(file: File) {
    this.scanning = true
    this.scanned_file = file
    const reader = new FileReader()
    reader.readAsDataURL(this.scanned_file)
    reader.onload = () => this.scanned_file_base64 = (reader.result as string)

    const reads = await this._apiService.readImage(file).toPromise()
    this.scanned_file && (this.compound_reads = reads)
    this.scanning = false
  }

  clearScan() {
    this.scanning = false
    this.scanned_file = null
    this.scanned_file_base64 = null
    this.compound_reads = []
  }

  getAccuracyColor(read: ICompoundRead) {
    if (read.accuracy > environment.readThreshold.match[0] && read.accuracy <= environment.readThreshold.match[1])
      return 'danger'
    if (read.accuracy > environment.readThreshold.undef[0] && read.accuracy <= environment.readThreshold.undef[1])
      return 'warning'
    if (read.accuracy > environment.readThreshold.unmatch[0] && read.accuracy <= environment.readThreshold.unmatch[1])
      return 'success'
  }
}
