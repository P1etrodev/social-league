import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { ChampionsService } from 'src/app/champions.service';
import { Spell } from 'src/models/champion.model';

@Component({
  selector: 'spell',
  imports: [],
  templateUrl: './spell.component.html',
  styleUrl: './spell.component.scss',
})
export class SpellComponent {
  private champsService = inject(ChampionsService);

  @Input() index!: number;
  @Input() spell!: Spell;
  @Input() isPassive = false;

  @Output() onHover = new EventEmitter<{ spell: Spell; isPassive: boolean }>();

  hover() {
    this.onHover.emit({ spell: this.spell, isPassive: this.isPassive });
  }

  get image() {
    return this.champsService.getSkill(this.spell.image.full, this.isPassive);
  }
}
