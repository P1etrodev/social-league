import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewQuote, Post } from 'src/models/post.model';

import { ChampionSelectComponent } from '../../champion-select/champion-select.component';
import { ChampionsService } from 'src/app/services/champions.service';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'new-quote',
  imports: [FormsModule, ReactiveFormsModule, ChampionSelectComponent],
  templateUrl: './new-quote.component.html',
  styleUrl: './new-quote.component.scss',
})
export class NewQuoteComponent {
  private supaService = inject(SupaService);
  champsService = inject(ChampionsService);

  @Input() postId!: string;
  @Output() onResponseAdded = new EventEmitter<Post>();

  newQuoteContent = new FormControl('', Validators.required);

  onSubmit() {
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(now);

    if (this.newQuoteContent.valid) {
      const newQuote: NewQuote = {
        created_at: formattedDate,
        champion_id: this.champsService.selectedChampion.id,
        content: this.newQuoteContent.value as string,
        quote_of: this.postId,
      };
      this.supaService
        .addQuote(newQuote)
        .then((res) => this.onResponseAdded.emit(res));
      this.newQuoteContent.reset();
    }
  }
}
