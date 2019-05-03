import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalVariables } from '../../global/global_variable';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { HomestayDetailPage } from '../homestay-detail/homestay-detail';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { NavParams } from 'ionic-angular/navigation/nav-params';

declare var cordova;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  private itemsCollection: AngularFirestoreCollection<any>;

  homestayList: Array<any> = [];
  user = GlobalVariables.user;
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore) {
    if(this.navParams.get('user')){
      this.user = this.navParams.get('user');
    }
    this.itemsCollection = this.db.collection<any>('homestays');
    this.itemsCollection.doc(this.user['base64']).collection("items").snapshotChanges().subscribe(()=>{
      this.getHomeStayList();
    })
  }

  editProfile() {
    this.navCtrl.push(EditProfilePage, { user: this.user });
  }

  viewDetail(item) {
    this.navCtrl.push(HomestayDetailPage, { homestay: item });
  }

  getHomeStayList() {
    this.homestayList = [];
    this.itemsCollection.doc(this.user['base64']).collection('items').get().subscribe(snap => {
      snap.forEach((doc) => {
        var obj = doc.data();
        obj['id'] = doc.id;
        this.homestayList.push(obj);
      });
    })
  }
}
