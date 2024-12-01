import { Component, OnInit, inject } from '@angular/core';
import { KeyValuePipe, NgClass, NgFor } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { Champion } from 'src/models/champion.model';
import { ChampionsService } from 'src/app/champions.service';
import { Comment } from 'src/models/comment.model';
import { CommentCardComponent } from '../../shared/comment-card/comment-card.component';
import { IdentifierPipe } from '../../pipes/identifier.pipe';
import { NgForOf } from '@angular/common';
import { Post } from 'src/models/post.model';
import { PostCardComponent } from '../../shared/post-card/post-card.component';
import { SkinsComponent } from './skins/skins.component';
import { SpellsComponent } from './spells/spells.component';
import { StarsComponent } from './stars/stars.component';
import { SupaService } from 'src/app/supa.service';
import { TagAsClass } from '../../pipes/tag-as-class.pipe';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  imports: [
    NgClass,
    NgFor,
    NgForOf,
    IdentifierPipe,
    KeyValuePipe,
    StarsComponent,
    SkinsComponent,
    PostCardComponent,
    CommentCardComponent,
    SpellsComponent,
    TagAsClass,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supaService = inject(SupaService);
  private titleService = inject(Title);
  champsService = inject(ChampionsService);

  champion!: Champion;
  posts!: Post[];
  comments!: Comment[];

  currentContent: 'posts' | 'comments' | 'skins' | 'skills' = 'posts';

  ngOnInit() {
    const championId = this.route.snapshot.paramMap.get('championId') as string;
    this.champsService
      .getFullChampion(championId)
      .then((result) => (this.champion = result))
      .then(() => {
        this.titleService.setTitle(`${this.champion.name} | ${document.title}`);
        this.supaService
          .fetchPosts(this.champion.id)
          .then((posts) => (this.posts = posts));
        this.supaService.fetchComments(this.champion.id).then((comments) => {
          this.comments = comments;
        });
      });
  }

  parseStatName(statName: string) {
    const translations: any = {
      attack: 'Ataque',
      defense: 'Defensa',
      difficulty: 'Dificultad',
      magic: 'Magia',
    };
    return translations[statName] as string;
  }

  setCurrentContent(content: 'posts' | 'comments' | 'skins') {
    this.currentContent = content;
  }
}
