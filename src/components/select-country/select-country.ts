import { Component, NgZone } from '@angular/core';
//import { AppProvider } from '../../providers/app/app';
import { ViewController } from 'ionic-angular';
import { UtilProvider } from '../../providers/util/util';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariables } from '../../global/global_variable';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { TabsPage } from '../../pages/tabs/tabs';

/**
 * Generated class for the SelectCountryComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'select-country',
  templateUrl: 'select-country.html'
})
export class SelectCountryComponent {

  country: string = '';
  user: object = GlobalVariables.user;

  private itemsCollection: AngularFirestoreCollection<any>;
  constructor(
    private util: UtilProvider,
    //private AppPro:AppProvider,
    private navCtrl: NavController,
    private zone: NgZone,
    private db: AngularFirestore,
    private viewCtrl: ViewController) {
    this.itemsCollection = this.db.collection<any>('users');
  }
  onItemSelected(ev) {
    this.country = ev;
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  save() {
    if (!this.country) {
      this.util.showAlert('Notice', 'Please select country first');
    } else {
      this.user['country'] = this.country;
      GlobalVariables.user['country'] = this.country;
      this.util.presentLoading();
      this.itemsCollection.doc(this.user['base64']).update(this.user).then(() => {
        this.util.stopLoading();
        this.viewCtrl.dismiss().then(()=>{
          this.zone.run(() => {
            this.navCtrl.setRoot(TabsPage);
          });
        });
      });
    }
  }
}
