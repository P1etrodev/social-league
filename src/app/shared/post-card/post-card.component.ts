import { Component, Input, OnInit, inject } from '@angular/core';

import { Champion } from 'src/models/champion.model';
import { ChampionsService } from 'src/app/services/champions.service';
import { IdentifierPipe } from '../../pipes/identifier.pipe';
import { NewQuoteComponent } from './new-quote/new-quote.component';
import { NewResponseComponent } from './new-response/new-response.component';
import { NgForOf } from '@angular/common';
import { Post } from 'src/models/post.model';
import { RelativeDatePipe } from 'src/app/pipes/relative-date.pipe';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'post-card',
  imports: [
    RelativeDatePipe,
    NgForOf,
    NewResponseComponent,
    IdentifierPipe,
    NewQuoteComponent,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent implements OnInit {
  private supaService = inject(SupaService);
  champsService = inject(ChampionsService);

  @Input() showComments = false;
  @Input() poster!: string;
  @Input() post!: Post;
  champion!: Champion;
  responses = new Array<Post>();

  ngOnInit() {
    this.champsService
      .fetchFullChampion(this.post.champion_id)
      .then((result) => (this.champion = result));

    if (this.showComments) {
      this.supaService
        .fetchResponses(this.post.id, 'post')
        .then((res) => (this.responses = res.responses));
    }
  }

  onResponseAdded(response: Post) {
    this.responses.push(response);
  }
}
