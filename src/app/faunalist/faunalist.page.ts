import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import {NavController} from '@ionic/angular';


@Component({
  selector: 'app-faunalist',
  templateUrl: './faunalist.page.html',
  styleUrls: ['./faunalist.page.scss'],
})
export class FaunalistPage implements OnInit {
  

  items: Array<any>;

  constructor(
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl:NavController
  ) { }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.getData();
    }
  }
  async getData(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.route.data.subscribe(routeData => {
      routeData['data'].subscribe(data => {
        loading.dismiss();
        this.items = data;
      })
    })
  }
  async presentLoading(loading) {
    return await loading.present();
  }

}
