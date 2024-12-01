import { ChampionsComponent } from './views/champions/champions.component';
import { HomeComponent } from './views/home/home.component';
import { PostComponent } from './views/post/post.component';
import { ProfileComponent } from './views/profile/profile.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio | Social League',
    component: HomeComponent,
  },
  {
    path: 'champions',
    component: ChampionsComponent,
  },
  {
    path: 'champions/:championId',
    component: ProfileComponent,
  },
  {
    path: 'post/:id',
    component: PostComponent,
  },
];
