import { NgModule } from '@angular/core';
import { SelectCountryComponent } from './select-country/select-country';
import { IonicModule } from 'ionic-angular';
import { AutoCompleteModule } from 'ionic2-auto-complete';
@NgModule({
	declarations: [SelectCountryComponent],
	imports: [IonicModule, AutoCompleteModule],
	entryComponents: [SelectCountryComponent],
	exports: [SelectCountryComponent]
})
export class ComponentsModule { }
