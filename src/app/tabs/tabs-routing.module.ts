import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:
      [
        {
          path: 'tab1',
          children:
            [
              {
                path: '',
                loadChildren: '../tab1/tab1.module#Tab1PageModule'
              }
            ]
        },
        {
          path: 'faunalist',
          children: [
            {
              
              path: '',
              loadChildren: '../faunalist/faunalist.module#FaunalistPageModule',
            }
          ]
        },
        {
          path: 'flora',
          children: [
            {
              
              path: '',
              loadChildren: '../flora/flora.module#FloraPageModule',
            }
          ]
        },
        {
          path: 'tab3',
          children:
            [
              {
                path: '',
                loadChildren: '../tab3/tab3.module#Tab3PageModule'
              }
            ]
        },
        {
          path: '',
          redirectTo: '/tabs/tab1',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class TabsPageRoutingModule {}