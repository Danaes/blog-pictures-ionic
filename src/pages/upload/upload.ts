import { Component } from '@angular/core';
import { ViewController } from '../../../node_modules/ionic-angular';
import { stringify } from '../../../node_modules/@angular/core/src/render3/util';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {

  title:string;
  imgPreview:string;

  constructor(private viewCtrl: ViewController,
              private camera: Camera) { }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  showCamera(){

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then(
      (imageData) => {
        this.imgPreview = 'data:image/jpeg;base64,' + imageData;
      }, 
      (err) => console.error("Error en camara", JSON.stringify( err ))
    );

  }

}
