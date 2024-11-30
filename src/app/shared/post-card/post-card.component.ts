import { Component, Input, OnInit, inject } from '@angular/core';

import { Champion } from 'src/models/champion.model';
import { ChampionsService } from 'src/app/champions.service';
import { Comment } from 'src/models/comment.model';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { IdentifierPipe } from '../../pipes/identifier.pipe';
import { NewCommentComponent } from './new-comment/new-comment.component';
import { NgForOf } from '@angular/common';
import { Post } from 'src/models/post.model';
import { RelativeDatePipe } from 'src/app/pipes/relative-date.pipe';
import { SupaService } from 'src/app/supa.service';

@Component({
  selector: 'post-card',
  imports: [
    RelativeDatePipe,
    NgForOf,
    CommentCardComponent,
    NewCommentComponent,
    IdentifierPipe,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent implements OnInit {
  private supaService = inject(SupaService);
  champsService = inject(ChampionsService);

  @Input() showComments = false;
  @Input() post!: Post;
  champion!: Champion;
  comments = new Array<Comment>();

  ngOnInit() {
    this.champsService
      .getFullChampion(this.post.champion)
      .then((result) => (this.champion = result));

    if (this.showComments) {
      this.supaService
        .fetchPostComments(this.post.id)
        .then((comments) => (this.comments = comments));
    }
  }

  onCommentAdded(comment: Comment) {
    this.comments.push(comment);
  }
}
