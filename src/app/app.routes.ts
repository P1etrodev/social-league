import { HomeComponent } from './views/home/home.component';
import { PostComponent } from './views/post/post.component';
import { ProfileComponent } from './views/profile/profile.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'profile/:championId',
    component: ProfileComponent,
  },
  {
    path: 'post/:id',
    component: PostComponent,
  },
];
