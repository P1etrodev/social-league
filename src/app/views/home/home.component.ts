import { Component, OnInit, inject } from '@angular/core';

import { NewPostComponent } from './new-post/new-post.component';
import { NgForOf } from '@angular/common';
import { Post } from 'src/models/post.model';
import { PostCardComponent } from 'src/app/shared/post-card/post-card.component';
import { SupaService } from 'src/app/supa.service';

@Component({
  selector: 'app-home',
  imports: [NgForOf, NewPostComponent, PostCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  supaService = inject(SupaService);

  onPostAdded(post: Post) {
    this.supaService.posts.push(post);
  }
}
