import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariables } from '../../global/global_variable';
import { UtilProvider } from '../../providers/util/util';
import { AppProvider } from '../../providers/app/app';

/**
 * Generated class for the HomestayViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-homestay-view',
  templateUrl: 'homestay-view.html',
})
export class HomestayViewPage {
  private itemsCollection: AngularFirestoreCollection<any>;

  user: any = GlobalVariables.user;
  homeStay: any = {};
  reviews: Array<any> = [];
  comment: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private util: UtilProvider,
    private appProvider: AppProvider,
    private storage: AngularFireStorage, private db: AngularFirestore) {
    this.homeStay = Object.assign({}, this.navParams.get('homestay'));
  }
  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'uploads/' + file['name'];
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    task.then(res => {
      this.storage.ref(filePath).getDownloadURL().subscribe(data => {
        if (data) {
          this.homeStay['picture'] = data;
        }
      })
    })
  }

  ionViewDidLoad() {
    this.itemsCollection = this.db.collection<any>('homestays');
    console.log('ionViewDidLoad HomestayDetailPage');
    this.getHomestayReviews();
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
  getHomestayReviews(){
    this.appProvider.getHomestayReviews(this.homeStay).then((data:any)=>{
        this.reviews = data;
    })
  }

  addReview(){
    if(this.comment!=''){
      this.util.presentLoading('Submitting review...');
      this.appProvider.addReview(this.user, this.homeStay, this.comment).then(()=>{
        this.util.stopLoading();
        this.getHomestayReviews();
      })
    }else{
      this.util.showAlert('Notice', 'Please input your review first!');
    }
  }
}
