import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { HomeComponent } from './components/home/home.component';
import { LiveComponent } from './components/live/live.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { AuthGuard } from './guards/auth.guard';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthenticationComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'about/:token',
    component: AboutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'newTask',
    component: NewTaskComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'live',
    component: LiveComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
