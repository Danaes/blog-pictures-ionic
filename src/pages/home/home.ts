import { UploadFileProvider } from './../../providers/upload-file/upload-file';
import { UploadPage } from './../upload/upload';
import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  hayMas: boolean = true;

  constructor(private modalCtrl: ModalController,
              private socialSharing: SocialSharing,
              private _ufp: UploadFileProvider) {

  }

  showModal(){
    
    let modal = this.modalCtrl.create( UploadPage );

    modal.present();
  }

  doInfinite(infiniteScroll) {
    this._ufp.loadImages().then((hayMas: boolean) => {
      
      this.hayMas = hayMas;
      infiniteScroll.complete();

    });
  }

  share( post:any ){

    this.socialSharing.share(post.title, "Estas compartiendo un post", post.img, post.img)
      .then(() => {} )  // Success!
      .catch(() => {} // Error!
    );

  }

}
