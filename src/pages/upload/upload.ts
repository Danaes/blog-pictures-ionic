import { UploadFileProvider } from './../../providers/upload-file/upload-file';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {

  title:string = "";
  imgPreview:string = "";
  image64: string;

  constructor(private viewCtrl: ViewController,
              private camera: Camera,
              private imagePicker: ImagePicker,
              public _ufp: UploadFileProvider) { }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  showCamera(){

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    
    this.camera.getPicture(options).then(
      (imageData) => {
        this.imgPreview = 'data:image/jpeg;base64,' + imageData;
        this.image64 = imageData;
      }, 
      (err) => console.error("Camera Error: ", JSON.stringify( err ))
    );

  }

  selectPhoto(){

    let options: ImagePickerOptions = {
      maximumImagesCount: 1,
      quality: 100,
      outputType: 1
    }

    this.imagePicker.getPictures(options).then((results) => {

      for (var i = 0; i < results.length; i++) {
          //console.log('Image URI: ' + results[i]);
          this.imgPreview = 'data:image/jpeg;base64,' + results[i];
          this.image64 = results[i];
      }

    }, (err) => console.error("ImagePicker Error:", err));

  }

  createPost(){

    let file = {
      title: this.title,
      img: this.image64
    };

    this._ufp.loadImgFirebase ( file ).then(() => this.closeModal());

  }

}
