import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { ChampionsService } from 'src/app/services/champions.service';
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
  @Input() type: 'passive' | 'skill' = 'skill';

  @Output() onHover = new EventEmitter<{
    spell: Spell;
    type: 'passive' | 'skill';
  }>();

  hover() {
    this.onHover.emit({ spell: this.spell, type: this.type });
  }

  get image() {
    return this.champsService.getSkill(this.spell.image.full, this.type);
  }
}
