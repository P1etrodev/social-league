import { Component, Input, OnInit, inject } from '@angular/core';

import { Champion } from 'src/models/champion.model';
import { ChampionsService } from 'src/app/champions.service';
import { IdentifierPipe } from '../../pipes/identifier.pipe';
import { SupaService } from 'src/app/supa.service';

@Component({
  selector: 'mini-profile',
  imports: [IdentifierPipe],
  templateUrl: './mini-profile.component.html',
  styleUrl: './mini-profile.component.scss',
})
export class MiniProfileComponent implements OnInit {
  private supaService = inject(SupaService);
  champsService = inject(ChampionsService);

  @Input() championId!: string;
  champion!: Champion;
  postCount!: number;
  commentCount!: number;

  ngOnInit() {
    this.champsService
      .getFullChampion(this.championId)
      .then((result) => (this.champion = result));

    this.supaService
      .fetchPostCount(this.championId)
      .then((result) => (this.postCount = result));

    this.supaService
      .fetchCommentCount(this.championId)
      .then((result) => (this.commentCount = result));
  }
}
