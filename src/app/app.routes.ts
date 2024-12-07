import { ChampionsComponent } from './views/champions/champions.component';
import { HomeComponent } from './views/home/home.component';
import { PostComponent } from './views/post/post.component';
import { ProfileComponent } from './views/profile/profile.component';
import { QuotesComponent } from './views/quotes/quotes.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio | Social League',
    component: HomeComponent,
  },
  {
    path: 'champions',
    children: [
      {
        path: '',
        component: ChampionsComponent,
      },
      {
        path: ':championId',
        component: ProfileComponent,
      },
    ],
  },
  {
    path: 'post/:id',
    children: [
      {
        path: '',
        component: PostComponent,
      },
      {
        path: 'quotes',
        component: QuotesComponent,
      },
    ],
  },
];
