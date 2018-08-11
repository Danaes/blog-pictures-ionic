import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';


@Injectable()
export class UploadFileProvider {

  imagenes: UploadFile[] = [];
  lastKey:string = null;

  constructor(private toastCtrl: ToastController,
              private afd: AngularFireDatabase) {

    this.loadLastKey().subscribe(() => this.loadImages() );
    
  }

  private loadLastKey() {

    return this.afd.list('/post', ref => ref.orderByKey().limitToLast(1) )
            .valueChanges()
            .map( (post:any) => {

              this.lastKey = post[0].key;
              this.imagenes.push( post[0] );
            });

  }

  loadImages(){

    return new Promise((resolve, reject) => {

      this.afd.list('/post', 

        ref => ref.limitToLast(4)
                  .orderByKey()
                  .endAt( this.lastKey )
    
      ).valueChanges()
      .subscribe( (posts:any) => {

        posts.pop();

        if( posts.length == 0 ){
          console.log("No hay mas registros");
          resolve(false);
          return;
        }

        this.lastKey = posts[0].key;

        for(let i = posts.length - 1; i >= 0; i--){
          let post = posts[i];
          this.imagenes.push(post);
        }

        resolve(true);

      });

    });
  }

  loadImgFirebase( image: UploadFile ){

    let promesa = new Promise((resolve, reject) => {
      
      //this.showToast("Cargando...");

      let storageRef = firebase.storage().ref();
      let filename: string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask = 
          storageRef.child(`img/${filename}`)
                    .putString( image.img, 'base64', {contentType: 'image/jpeg'} );
      
      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED, 
        
        () => {}, // saber el % de Mbs se han subido
        ( err ) => { //ERROR

          console.error("Upload Error:", JSON.stringify( err ));
          this.showToast( JSON.stringify( err ) );
          
          reject();
        },
        () => { //Ok
          
          console.log('Todo bien');
          this.showToast("Imagen cargada correctamente!");

          let url = uploadTask.snapshot.downloadURL;

          this.createPost( image.title, url, filename);

          resolve();

        }
      
      )

    });

    return promesa;

  }

  private createPost( title:string, url:string, filename:string ){

    let post: UploadFile = {
      img: url,
      title: title,
      key: filename
    };

    this.afd.object(`/post/${ filename }`).update(post);

    this.imagenes.push( post );

  }

  showToast( msg: string){
    this.toastCtrl.create({
      message: msg,
      duration: 2500
    }).present();
  }

}

interface UploadFile {
  title: string;
  img: string;
  key?: string;
}
