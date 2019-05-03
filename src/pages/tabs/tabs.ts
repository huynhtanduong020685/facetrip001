import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { LocalDetailPage } from '../local-detail/local-detail';
import { Tabs, Events } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild (Tabs) tabs:Tabs;
  // tab0Root = HomePage
  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor(public events: Events) {

    this.events.subscribe('tab_changed_1',()=>{
      this.tabs.select(1);
    })

    //  this.events.subscribe('tab_changed_0',()=>{
    //   this.tabs.select(0);
    //  })


     this.events.subscribe('tab_changed_2',()=>{
       this.tabs.select(2);
     })
  }


}
