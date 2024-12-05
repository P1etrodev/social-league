import { NewPost, NewQuote, NewResponse, Post } from 'src/models/post.model';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SupaService {
  private supa: SupabaseClient;
  private postsTableName = 'posts_v2';
  private postColumns = `*,
        responses_count:posts_v2!response_of(count),
        quotes_count:posts_v2!quote_of(count)`;

  constructor() {
    this.supa = createClient(
      'https://icogdobvfvtlawbtcoes.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb2dkb2J2ZnZ0bGF3YnRjb2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3NTA3NzQsImV4cCI6MjA0ODMyNjc3NH0.9oXo9UZZRWXhQdV-610fNyWgUIAr6-Yj6YmR_pCSZLI'
    );
  }

  async fetchPosts(championId?: string) {
    const query = this.supa
      .from('posts_v2')
      .select(this.postColumns, { count: 'exact' })
      .is('response_of', null)
      .order('created_at', { ascending: true });
    if (championId) {
      query.eq('champion_id', championId);
    }
    const response: any = await query;
    return { posts: response.data as Post[], count: response.count || 0 };
  }

  async fetchResponses(id: string, _for: 'champion' | 'post') {
    const query = this.supa
      .from(this.postsTableName)
      .select(this.postColumns, { count: 'exact' })
      .filter('response_of', 'not.is', null)
      .order('created_at', { ascending: true });
    switch (_for) {
      case 'champion':
        query.eq('champion_id', id);
        break;
      case 'post':
        query.eq('response_of', id);
        break;
    }
    const response: any = await query;
    return { responses: response.data as Post[], count: response.count || 0 };
  }

  async fetchQuotes(id: string, _for: 'champion' | 'post') {
    const query = this.supa
      .from(this.postsTableName)
      .select(this.postColumns, { count: 'exact' })
      .not('quote_of', 'eq', null)
      .order('created_at', { ascending: true });
    switch (_for) {
      case 'champion':
        query.eq('champion_id', id);
        break;
      case 'post':
        query.eq('quote_of', id);
        break;
    }
    const response: any = await query;
    return { quotes: response.data as Post[], count: response.count || 0 };
  }

  async fetchSinglePost(id: string) {
    return await this.supa
      .from(this.postsTableName)
      .select(this.postColumns)
      .eq('id', id)
      .maybeSingle()
      .then((response: any) => response.data as Post);
  }

  async addPost(newPost: NewPost) {
    return this.supa
      .from(this.postsTableName)
      .insert(newPost)
      .select(this.postColumns)
      .single()
      .then((response: any) => response.data as Post);
  }

  async addResponse(newResponse: NewResponse) {
    return await this.supa
      .from(this.postsTableName)
      .insert(newResponse)
      .select(this.postColumns)
      .single()
      .then((response: any) => response.data as Post);
  }

  async addQuote(newQuote: NewQuote) {
    return await this.supa
      .from(this.postsTableName)
      .insert(newQuote)
      .select(this.postColumns)
      .single()
      .then((response: any) => response.data as Post);
  }
}
