import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms'
import {ReactiveFormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http'
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import {CreateRideComponent} from './Rides/create-ride/create-ride.component'
import {ConfirmRideComponent} from './Rides/confirm-ride/confirm-ride.component'
import {RideHistoryComponent} from './Rides/ride-history/ride-history.component'
import {DriverListComponent} from './Drivers/driver-list/driver-list.component'
import {RunningRequestComponent} from './Drivers/running-request/running-request.component'
import {CityComponent} from './Pricing/city/city.component'
import {CountryComponent} from './Pricing/country/country.component'
import {VehiclePriceComponent} from './Pricing/vehicle-price/vehicle-price.component'
import {VehicleTypeComponent} from './Pricing/vehicle-type/vehicle-type.component'
import {UsersComponent} from './users/users.component'
import {SettingsComponent} from './settings/settings.component';
import { FilterPipePipe } from './pipes/filter-pipe.pipe';
import { CityFilterPipe } from './pipes/city-filter.pipe';
import { UserFilterPipe } from './user-filter.pipe';
import { DriverFilterPipe } from './driver-filter.pipe';
import { LoaderComponent } from './loader/loader.component';
import { StatusFilterPipe } from './pipes/status-filter.pipe';
import { ConfirmRidesPipe } from './pipes/confirm-rides.pipe';
import { RidehistoryPipe } from './pipes/ridehistory.pipe';
import { DriverPipe } from './pipes/driver.pipe';

const appRoutes:Routes=[
  {path: '', component:CreateRideComponent},
  {path:'createRide', component: CreateRideComponent},
  {path:'confirmRide', component: ConfirmRideComponent},
  {path:'rideHistory', component: RideHistoryComponent},
  {path:'driverList', component: DriverListComponent},
  {path:'runnigRequest', component: RunningRequestComponent},
  {path:'city', component: CityComponent},
  {path:'country', component: CountryComponent},
  {path:'vehiclePrice', component: VehiclePriceComponent},
  {path:'vehicleType', component: VehicleTypeComponent},
  {path:'users', component: UsersComponent},
  {path:'setting', component: SettingsComponent},
]
@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    CountryComponent,
    CityComponent,
    UsersComponent,
    DriverListComponent,
    ConfirmRideComponent,
    CreateRideComponent,
    RideHistoryComponent,
    RunningRequestComponent,
    VehiclePriceComponent,
    VehicleTypeComponent,
    SettingsComponent,
    FilterPipePipe,
    CityFilterPipe,
    UserFilterPipe,
    DriverFilterPipe,
    LoaderComponent,
    StatusFilterPipe,
    ConfirmRidesPipe,
    RidehistoryPipe,
    DriverPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    CommonModule
  ],
  schemas:[NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
