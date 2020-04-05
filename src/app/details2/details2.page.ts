import { Component, OnInit } from '@angular/core';
import { FaunaService } from '../services/fauna.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details2',
  templateUrl: './details2.page.html',
  styleUrls: ['./details2.page.scss'],
})
export class Details2Page implements OnInit {

  validations_form: FormGroup;
  image: any;
  item: any;
  title: any;
  load: boolean = false;

  constructor(
    private imagePicker: ImagePicker,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private firebaseService: FaunaService,
    private webview: WebView,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.route.data.subscribe(routeData => {
     let data = routeData['data'];
     if (data) {
       this.item = data;
       this.image = this.item.image;
       this.title = this.item.title;
     }
    })
    this.validations_form = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      scientificName: new FormControl('', Validators.required),
      mayaName: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  onSubmit(value){
    let data = {
      title: value.title,
      scientificName: value.scientificName,
      mayaName: value.mayaName,
      type: value.type,
      description: value.description,
      image: this.image
    }
    this.firebaseService.updateTask(this.item.id,data)
    .then(
      res => {
        this.router.navigate(["/fauna"]);
      }
    )
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Quieres Eliminarlo ' + this.item.title + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.firebaseService.deleteTask(this.item.id)
            .then(
              res => {
                this.router.navigate(["/fauna"]);
              },
              err => console.log(err)
            )
          }
        }
      ]
    });
    await alert.present();
  }

  openImagePicker(){
    this.imagePicker.hasReadPermission()
    .then((result) => {
      if(result == false){
        // no callbacks required as this opens a popup which returns async
        this.imagePicker.requestReadPermission();
      }
      else if(result == true){
        this.imagePicker.getPictures({
          maximumImagesCount: 1
        }).then(
          (results) => {
            for (var i = 0; i < results.length; i++) {
              this.uploadImageToFirebase(results[i]);
            }
          }, (err) => console.log(err)
        );
      }
    }, (err) => {
      console.log(err);
    });
  }

  async uploadImageToFirebase(image){
    const loading = await this.loadingCtrl.create({
      message: 'Por favor espere...'
    });
    const toast = await this.toastCtrl.create({
      message: 'La imagen se ha subido correctamente',
      duration: 3000
    });
    this.presentLoading(loading);
    let image_src = this.webview.convertFileSrc(image);
    let randomId = Math.random().toString(36).substr(2, 5);

    this.firebaseService.uploadImage(image_src, randomId)
    .then(photoURL => {
      this.image = photoURL;
      loading.dismiss();
      toast.present();
    }, err =>{
      console.log(err);
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}