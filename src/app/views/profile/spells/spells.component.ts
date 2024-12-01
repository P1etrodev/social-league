import { Component, Input, OnInit, inject } from '@angular/core';

import { ChampionsService } from 'src/app/champions.service';
import { NgForOf } from '@angular/common';
import { Spell } from 'src/models/champion.model';
import { SpellComponent } from '../spell/spell.component';

@Component({
  selector: 'app-spells',
  imports: [NgForOf, SpellComponent],
  templateUrl: './spells.component.html',
  styleUrl: './spells.component.scss',
})
export class SpellsComponent implements OnInit {
  champsService = inject(ChampionsService);

  @Input() passive!: Spell;
  @Input() spells!: Spell[];

  current!: { spell: Spell; isPassive: boolean };

  ngOnInit(): void {
    this.current = { spell: this.passive, isPassive: true };
  }

  get currentName() {
    const prefixes = ['Q', 'W', 'E', 'R'];
    const prefix = !this.current.isPassive
      ? prefixes[this.spells.indexOf(this.current.spell)]
      : 'Pasiva';
    return `${this.current.spell.name} (${prefix})`;
  }

  get currentDescription() {
    return this.current.spell.description.replace(/<\/?.+>/g, '');
  }
}
