import { NewPost, Post } from 'src/models/post.model';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { Comment } from 'src/models/comment.model';
import { Injectable } from '@angular/core';
import { NewComment } from 'src/models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class SupaService {
  private supa: SupabaseClient;

  posts!: Post[];
  comments!: Comment[];

  constructor() {
    this.supa = createClient(
      'https://icogdobvfvtlawbtcoes.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb2dkb2J2ZnZ0bGF3YnRjb2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3NTA3NzQsImV4cCI6MjA0ODMyNjc3NH0.9oXo9UZZRWXhQdV-610fNyWgUIAr6-Yj6YmR_pCSZLI'
    );
    this.fetchPosts().then((posts) => (this.posts = posts));
  }

  async fetchPostCount(championId: string) {
    return await this.supa
      .from('posts')
      .select('id', { count: 'exact' })
      .eq('champion', championId)
      .then((response) => response.count || 0);
  }

  async fetchCommentCount(championId: string) {
    return await this.supa
      .from('comments')
      .select('id', { count: 'exact' })
      .eq('champion', championId)
      .then((response) => response.count || 0);
  }

  async fetchPosts(championId?: string) {
    try {
      if (championId) {
        return await this.supa
          .from('posts')
          .select('*, comments(count))')
          .eq('champion', championId)
          .order('created_at', { ascending: true })
          .then((response: any) => response.data as Post[]);
      }
      return await this.supa
        .from('posts')
        .select('*, comments(count))')
        .order('created_at', { ascending: true })
        .then((response: any) => response.data as Post[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  async fetchComments(championId: string) {
    return await this.supa
      .from('comments')
      .select('*')
      .eq('champion', championId)
      .order('created_at', { ascending: true })
      .then((response: any) => response.data as Comment[]);
  }

  async fetchSinglePost(id: string) {
    return await this.supa
      .from('posts')
      .select('*, comments(count))')
      .eq('id', id)
      .maybeSingle()
      .then((response: any) => response.data as Post);
  }

  async fetchPostComments(postId: string) {
    return await this.supa
      .from('comments')
      .select()
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then((response) => response.data as Comment[]);
  }

  async addPost(newPost: NewPost) {
    return this.supa
      .from('posts')
      .insert(newPost)
      .select('*, comments(count)')
      .single()
      .then((response: any) => response.data as Post);
  }

  async addComment(newComment: NewComment) {
    return await this.supa
      .from('comments')
      .insert(newComment)
      .select()
      .single()
      .then((response: any) => response.data as Comment);
  }
}
