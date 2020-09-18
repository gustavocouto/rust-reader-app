import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { pathToFileURL } from 'url';
import { ReaderComponent } from './reader/reader.component';
import { LabelsComponent } from './labels/labels.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'reader',
    pathMatch: 'full'
  },
  {
    path: 'reader',
    component: ReaderComponent
  },
  {
    path: 'labels',
    component: LabelsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MainRoutingModule {}
