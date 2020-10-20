import { AfterContentInit, AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent implements AfterContentInit, OnChanges {
  @Input('monsterName') monsterName: string

  imageSource: string

  constructor() { }

  private reloadImageSource() {
    const emptySrc = './assets/camera.png'
    const monsterSrc = `./assets/monsters/${this.monsterName}.png`
    this.imageSource = this.monsterName ? monsterSrc : emptySrc
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.monsterName.currentValue)
      this.reloadImageSource()
  }

  ngAfterContentInit(): void {
    this.reloadImageSource()
  }
}