import { Component, Input } from '@angular/core';

import { PartialChampion } from 'src/models/champion.model';

@Component({
  selector: 'champion-card',
  imports: [],
  templateUrl: './champion-card.component.html',
  styleUrl: './champion-card.component.scss',
})
export class ChampionCardComponent {
  @Input() champion!: PartialChampion;
}
