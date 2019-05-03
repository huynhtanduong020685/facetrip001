import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AppProvider } from '../../providers/app/app';
//import { GlobalVariables } from '../../global/global_variable';
import { UtilProvider } from '../../providers/util/util';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  @ViewChild(Content) content: Content;
  itemsCollection: AngularFirestoreCollection<any>;

  message: string = '';
  receiver: any = {};
  user: any = {};
  msgList: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFirestore,
    private util: UtilProvider,
    private appProvider: AppProvider) {
    this.receiver = Object.assign({}, this.navParams.get('receiver'));
    this.user = Object.assign({}, this.navParams.get('user'));
    this.appProvider.addChageHistory(this.user['base64'], this.receiver).then(()=>{
      console.log('save chat');
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatsPage');
    this.itemsCollection = this.db.collection<any>('chats');
    this.itemsCollection.doc(this.util.getChatId(this.user['base64'], this.receiver['base64'])).collection("chats",ref=>ref.orderBy('date')).snapshotChanges().subscribe(data => {
      this.msgList = [];
      data.forEach(doc => {
        var chat = doc.payload.doc.data();
        chat['id'] = doc.payload.doc.id;
        this.msgList.push(chat);
      })
    })
  }

  submitChat() {
    if (this.message != '') {
      this.appProvider.submitChat(this.user['base64'], this.receiver['base64'], this.message).then(() => {
        this.content.scrollToBottom();
      });
      this.message = '';
    }
  }

  getChatList() {
    this.appProvider.getChatList(this.user['base64'], this.receiver['base64']).then((chats: any) => {
      this.msgList = chats;
    })
  }
}
