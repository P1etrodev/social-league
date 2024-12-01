import { Component, inject } from '@angular/core';

import { ChampionCardComponent } from './champion-card/champion-card.component';
import { ChampionsService } from 'src/app/champions.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-champions',
  imports: [NgForOf, ChampionCardComponent],
  templateUrl: './champions.component.html',
  styleUrl: './champions.component.scss',
})
export class ChampionsComponent {
  champsService = inject(ChampionsService);
}
