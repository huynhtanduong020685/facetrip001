import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Events } from 'ionic-angular';

/*
  Generated class for the UtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilProvider {
   private loader;
  constructor(private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public events: Events,
    private storage: Storage, private modalCtrl: ModalController) {

  }

  showToast(message) {
    return new Promise(resolve => {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    })

  }
  /**
   * Show Loading
   *
   *
   * @memberOf HelpToolProvider
   */
  presentLoading(content = 'Data loading...') {
    this.loader = this.loadingCtrl.create(
      {
        spinner: 'crescent',
        content: content
      }
    );
    this.loader.present();
  }
  /**
   * Stop Show Loading
   *
   *
   * @memberOf HelpToolProvider
   */
  stopLoading() {
    this.loader.dismiss();
  }

  setLocal(key, value) {
    return this.storage.set(key, value);
  }

  getLocal(key) {
    return this.storage.get(key);
  }

  clearLocal() {
    return this.storage.clear();
  }

  /**
 * show modal
 * @param component
 * @param data
 */
  showModal(component: any, data?: any, cssClass: string = 'full') {
    return new Promise((resolve) => {
      let modal = null;
      let opts = {

      };
      if (cssClass) {
        opts['cssClass'] = cssClass;
      }
      modal = this.modalCtrl.create(component, data, opts);
      modal.onDidDismiss(_data => {
        resolve(_data);
      });
      modal.present();
    });

  }

  showAlert(title: string, subTitle: string) {
    this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Close']
    }).present();

  }

  confirm(title: string, subTitle: string) {
    return new Promise((resolve) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: subTitle,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              resolve('no');
            }
          },
          {
            text: 'Remove',
            handler: () => {
              resolve('yes');
            }
          }
        ]
      });
      alert.present();
    })

  }
  showConfirm(title: string, subTitle: string) {

    return new Promise(resolve => {
      this.alertCtrl.create({
        title: title,
        subTitle: subTitle,
        inputs: [
          {
            name: 'amount',
            placeholder: 'Amount that you have',
            type: 'number'
          },
          {
            name: 'invested',
            placeholder: 'Total invested (optional)',
            type: 'number'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              resolve();
            }
          },
          {
            text: 'Add',
            handler: data => {
              resolve(data);
            }
          }
        ]
      }).present();

    })

  }
  mapCMCToCPC(coinmarketcap, cryptocompare) {
    if (!coinmarketcap)
      return null;
    //Convert an object with keys into an array of objects
    cryptocompare = Object.keys(cryptocompare).map(i => cryptocompare[i])

    let ignoreSpaceRegex = /\s/g, nonAlphaNumericRegex = /\W+/g
    let map = {}, symbol1, name1, symbol2, name2, reduced

    //Loop through every item in coinmarketcap
    //Note that symbols such as BTM, KNC will be repeated multiple times


    //Get the symbol of the current coin on coinmarketcap
    symbol1 = coinmarketcap.symbol

    name1 = coinmarketcap.name.trim().replace(ignoreSpaceRegex, "").toLowerCase()


    // if(coinmarketcap[i].rank < 700){
    //Loop through every item on cryptocompare
    for (let j = cryptocompare.length - 1; j >= 0; j--) {

      //Get the symbol of the current coin on cryptocompare
      symbol2 = cryptocompare[j].Symbol
      reduced = symbol2.replace(nonAlphaNumericRegex, "")
      name2 = cryptocompare[j].CoinName.trim().replace(ignoreSpaceRegex, "").toLowerCase()
      if (reduced.indexOf(symbol1) >= 0 && name1 === name2) {
        map[symbol1] = symbol2;
      }
      if (symbol1.toLowerCase() == 'trx') {
        if (symbol2.toLowerCase() == 'trx') {
          map[symbol1] = symbol2;
        }
      }
    }

    return map
  }

  ValidURL(str) {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    var regexp = new RegExp(expression);
    return regexp.test(str);
  }

  extractUrl(str) {
    return str.match(/(https?:\/\/[^ ]*)/)[0];
  }

  removeSpecialChar(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '_');
  }
  scrollTo(element, to, duration) {

    var start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;
    var easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    var animateScroll = () => {
      currentTime += increment;
      var val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }




  registerEvent(name, callback) {
    // this.events.unsubscribe(name);
    this.events.subscribe(name, callback);
  }
  publishEvent(name, params?) {
    this.events.publish(name, params);
  }

  generateEmail() {
    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var string = 'cust_';
    for (var ii = 0; ii < 8; ii++) {
      string += chars[Math.floor(Math.random() * chars.length)];
    }
    return (string + '@gmail.com');

  }

  getChatId(id1, id2) {
    var chatId = '';
    if (id1 < id2) {
      chatId = id1 + id2;
    } else {
      chatId = id2 + id1;
    }
    return chatId;
  }
}
