import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { FilterByPipe } from '../../pipes/filter-by/filter-by';
import { GlobalVariables } from '../../global/global_variable';
import { AutoCompleteService } from 'ionic2-auto-complete';
import { map } from 'rxjs/operators';

/*
  Generated class for the AppProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppProvider implements AutoCompleteService {

  localCollections: AngularFirestoreCollection<any>;
  homestayCollections: AngularFirestoreCollection<any>;
  chatCollections: AngularFirestoreCollection<any>;
  chatHistoryCollections: AngularFirestoreCollection<any>;
  reviewCollections: AngularFirestoreCollection<any>;
  constructor(public http: HttpClient, public db: AngularFirestore) {
    console.log('Hello AppProvider Provider');
    this.localCollections = this.db.collection<any>('users');
    this.homestayCollections = this.db.collection<any>('homestays');
    this.chatCollections = this.db.collection<any>('chats');
    this.chatHistoryCollections = this.db.collection<any>('chatHistory');
    this.reviewCollections = this.db.collection<any>('reviews');

  }

  getResults(keyword) {
    return this.http.get("https://restcountries.eu/rest/v1/name/" + keyword).pipe(map(
      (result: any) => {
        return result.filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase())).map(i => i.name);
      })
    )
  }

  getContryList() {
    return this.http.get('https://restcountries.eu/rest/v2/all');
  }

  searchLocal(country, language) {
    return new Promise(resolve => {
      var rs = [];
      var filterBy = new FilterByPipe();
      this.localCollections.get().subscribe(snap => {
        snap.forEach(doc => {
          var docData = doc.data();
          docData['country'] = docData['country'] || '';
          docData['languages'] = `${docData['language1']},${docData['language2']},${docData['language3']},${docData['language4']}`;
          if (docData['base64'] != GlobalVariables.user['base64']) {
            rs.push(docData);
          }
        })
        var filter = filterBy.transform(rs, {
          country: country,
          languages: language
        });
        resolve(filter);
      }, () => resolve())
    })
  }

  addReview(user, homestay, review) {
    return this.reviewCollections.doc(homestay['id']).collection('items').add({
      name: user['name'],
      picture: user['picture'],
      review: review
    })
  }
  getHomestayReviews(homestay) {
    return new Promise(resolve => {
      let rs = [];
      this.reviewCollections.doc(homestay['id']).collection('items').get().subscribe(snap => {
        snap.forEach(doc => {
          var docData = doc.data();
          docData['id'] = doc.id;
          rs.push(docData);
        })
        resolve(rs);
      }, err => resolve([]));
    });

  }

  getChatList(id1, id2) {
    var chatId = '';
    if (id1 < id2) {
      chatId = id1 + id2;
    } else {
      chatId = id2 + id1;
    }
    return new Promise(resolve => {
      let rs = [];
      this.chatCollections.doc(chatId).collection('items', ref => ref.orderBy('date')).get().subscribe(snap => {
        snap.forEach(doc => {
          var docData = doc.data();
          docData['id'] = doc.id;
          rs.push(docData);
        })
        resolve(rs);
      }, err => resolve(rs))
    });
  }

  addChageHistory(userId, partner){
    return this.chatHistoryCollections.doc(userId).collection('items').doc(partner['base64']).set(partner);
  }

  getChatHistory(userID) {
    return new Promise(resolve => {
      let rs = [];
      this.chatHistoryCollections.doc(userID).collection('items').get().subscribe(snap=>{
        snap.forEach(doc=>{
          var docData = doc.data();
          docData['id']= doc.id;
          rs.push(docData);
        })
        resolve(rs);
      }, err=> resolve())
    })
  }
  submitChat(id1, id2, message) {
    var chatId = '';
    if (id1 < id2) {
      chatId = id1 + id2;
    } else {
      chatId = id2 + id1;
    }
    return this.chatCollections.doc(chatId).collection('chats').add({
      sender: id1,
      receiver: id2,
      message: message,
      date: new Date().getTime()
    })
  }
}
