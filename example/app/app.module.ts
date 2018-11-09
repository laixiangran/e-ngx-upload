import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ENgxUploadModule } from '../../src/e-ngx-upload.module';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		ENgxUploadModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
