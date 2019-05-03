import { NgModule } from '@angular/core';
import { FilterPipe } from './filter/filter';
import { FilterByPipe } from './filter-by/filter-by';
@NgModule({
	declarations: [FilterPipe,
		FilterByPipe
	],
	imports: [],
	exports: [FilterPipe,
		FilterByPipe]
})
export class PipesModule { }
