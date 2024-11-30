import { Comment, NewComment } from 'src/models/comment.model';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Champion } from 'src/models/champion.model';
import { ChampionSelectComponent } from '../../../shared/champion-select/champion-select.component';
import { ChampionsService } from 'src/app/champions.service';
import { SupaService } from 'src/app/supa.service';

@Component({
  selector: 'new-comment',
  imports: [FormsModule, ReactiveFormsModule, ChampionSelectComponent],
  templateUrl: './new-comment.component.html',
  styleUrl: './new-comment.component.scss',
})
export class NewCommentComponent {
  private supaService = inject(SupaService);
  champsService = inject(ChampionsService);

  @Input() postId!: string;
  @Output() onCommentAdded = new EventEmitter<Comment>();

  newCommentContent = new FormControl('', Validators.required);

  onSubmit() {
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(now);

    if (this.newCommentContent.valid) {
      const newComment: NewComment = {
        created_at: formattedDate,
        champion: this.champsService.selectedChampion.id,
        content: this.newCommentContent.value as string,
        post_id: this.postId,
      };
      this.supaService
        .addComment(newComment)
        .then((comment) => this.onCommentAdded.emit(comment));
      this.newCommentContent.reset();
    }
  }
}
