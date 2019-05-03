import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppProvider } from '../../providers/app/app';
import { GlobalVariables } from '../../global/global_variable';
import { ChatsPage } from '../chats/chats';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  chatHistory: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private appProvider: AppProvider) {
    this.appProvider.getChatHistory(GlobalVariables.user['base64']).then((data: any)=>{
      this.chatHistory = data;
    })

  }
  ionViewDidEnter(){
    var receiver = Object. assign({}, GlobalVariables.selectedUser);
    if(receiver&&receiver['base64']){
      GlobalVariables.selectedUser = {};
      this.goToChat(receiver);
    }
  }
  goToChat(user){
    this.navCtrl.push(ChatsPage,{receiver: user, user: GlobalVariables.user});
  }
}
