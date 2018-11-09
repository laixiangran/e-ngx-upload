import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ENgxUploadComponent } from './e-ngx-upload.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		ENgxUploadComponent
	],
	exports: [
		CommonModule,
		ENgxUploadComponent
	]
})
export class ENgxUploadModule {
}
