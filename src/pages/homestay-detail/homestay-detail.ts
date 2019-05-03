import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariables } from '../../global/global_variable';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the HomestayDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-homestay-detail',
  templateUrl: 'homestay-detail.html',
})
export class HomestayDetailPage {
  private itemsCollection: AngularFirestoreCollection<any>;

  user: any = GlobalVariables.user;
  homeStay: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private util: UtilProvider,
    private storage: AngularFireStorage, private db: AngularFirestore) {
    this.homeStay = Object.assign({}, this.navParams.get('homestay'));
  }
  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'uploads/' + file['name'];
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.util.presentLoading();
    task.then(res => {
      this.storage.ref(filePath).getDownloadURL().subscribe(data => {
        if (data) {
          this.homeStay['picture'] = data;
        }
        this.util.stopLoading();
      })
    },err=> this.util.stopLoading())
  }

  ionViewDidLoad() {
    this.itemsCollection = this.db.collection<any>('homestays');
    console.log('ionViewDidLoad HomestayDetailPage');
  }

  submitHomeStay() {
    this.util.presentLoading();
    var userRef = this.itemsCollection.doc(this.user['base64']);
    if (this.homeStay['id']) {
      userRef.collection("items").doc(this.homeStay['id']).update(this.homeStay).then((data) => {
        console.log(data);
        this.util.stopLoading();
      }, err => { this.util.stopLoading() });

    } else {
      userRef.collection("items").add(this.homeStay).then((data) => {
        console.log(data);
        this.util.stopLoading();
      }, err => { this.util.stopLoading() });

    }

  }

}
