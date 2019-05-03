import { ContactPage } from './../contact/contact';
import { Component } from '@angular/core';
import { NavController, Events, Platform } from 'ionic-angular';
import { GlobalVariables } from '../../global/global_variable';
import { EditProfilePage } from '../edit-profile/edit-profile';
//import { HomestayDetailPage } from '../homestay-detail/homestay-detail';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { HomestayViewPage } from '../homestay-view/homestay-view';
import { ChatsPage } from '../chats/chats';

declare var cordova;

@Component({
  selector: 'page-local-detail',
  templateUrl: 'local-detail.html',
})
export class LocalDetailPage {
  private itemsCollection: AngularFirestoreCollection<any>;

  homestayList: Array<any> = [];
  user = GlobalVariables.selectedUser;
  constructor(public navCtrl: NavController,
    public platform: Platform,
    public navParams: NavParams, private db: AngularFirestore,
    private events: Events
    ) {
    if(this.navParams.get('user')){
      this.user = this.navParams.get('user');
      GlobalVariables.selectedUser = this.user;
    }
    this.user = GlobalVariables.selectedUser;
    // if(!this.user['base64'])
    // {
    //   this.back();
    //   return;
    // }else{
      this.itemsCollection = this.db.collection<any>('homestays');
      this.itemsCollection.doc(this.user['base64']).collection("items").snapshotChanges().subscribe(()=>{
        this.getHomeStayList();
      })
    //   this.events.publish('tab_changed_1');

    // }


  }

  ionViewDidEnter(){
    // this.user = GlobalVariables.selectedUser;
    // if(!this.user['base64'])
    // {
    //   this.back();
    //   return;
    // }else{
    //   this.itemsCollection = this.db.collection<any>('homestays');
    //   this.itemsCollection.doc(this.user['base64']).collection("items").snapshotChanges().subscribe(()=>{
    //     this.getHomeStayList();
    //   })
    //   this.events.publish('tab_changed_1');
    // }


  }
  editProfile() {
    this.navCtrl.push(EditProfilePage, { user: this.user });
  }

  viewDetail(item) {
    this.navCtrl.push(HomestayViewPage, { homestay: item });
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

  goToChat(){
    GlobalVariables.selectedUser = this.user;

    this.events.publish('tab_changed_2');
    // this.navCtrl.setRoot(ContactPage, {receiver: this.user, user: GlobalVariables.user});
  }

  back(){
    this.events.publish('tab_changed_0');

  }
  openBrowser(fb_id) {
    if(this.platform.is('cordova')){
       cordova.InAppBrowser.open('https://fb.com/' + fb_id, '_blank', 'location=yes');
    }
  }
}
