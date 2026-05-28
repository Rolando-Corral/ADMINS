import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './shared/components/header/header.component';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';
import { NotificationContainerComponent } from './shared/components/notifications/notification-container.component';

@NgModule({
  declarations: [
    AppComponent,
    NotificationsComponent,
    NotificationContainerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HeaderComponent,
    NgChartsModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
