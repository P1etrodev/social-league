import { Component, Input, inject } from '@angular/core';

import { Champion } from 'src/models/champion.model';
import { ChampionsService } from 'src/app/champions.service';
import { Comment } from 'src/models/comment.model';
import { IdentifierPipe } from '../../pipes/identifier.pipe';
import { RelativeDatePipe } from 'src/app/pipes/relative-date.pipe';

@Component({
  selector: 'comment-card',
  imports: [RelativeDatePipe, IdentifierPipe],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss',
})
export class CommentCardComponent {
  champsService = inject(ChampionsService);

  champion!: Champion;

  @Input() withPostUrl = false;
  @Input() poster!: string;
  @Input() comment!: Comment;

  ngOnInit(): void {
    this.champsService
      .getFullChampion(this.comment.champion)
      .then((result) => (this.champion = result));
  }
}
