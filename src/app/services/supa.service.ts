import { Injectable, inject } from '@angular/core';
import { NewPost, NewQuote, NewResponse, Post } from 'src/models/post.model';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class SupaService {
  private cacheService = inject(CacheService);
  private supa: SupabaseClient;
  private postsTableName = 'posts_v2';
  private postColumns = `*,
        responses_count:posts_v2!response_of(count),
        quotes_count:posts_v2!quote_of(count)`;

  newPosts = 0;

  constructor() {
    this.supa = createClient(
      'https://icogdobvfvtlawbtcoes.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb2dkb2J2ZnZ0bGF3YnRjb2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3NTA3NzQsImV4cCI6MjA0ODMyNjc3NH0.9oXo9UZZRWXhQdV-610fNyWgUIAr6-Yj6YmR_pCSZLI'
    );
    this.supa
      .channel('new_posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: this.postsTableName },
        () => this.newPosts++
      )
      .subscribe();
  }

  async fetchPosts(championId?: string) {
    let cacheKeys = ['db', 'posts', 'all'];
    if (championId) cacheKeys = ['db', 'posts', championId];
    const cachedPosts = this.cacheService.get(cacheKeys);
    if (cachedPosts && this.newPosts === 0) return cachedPosts;
    const query = this.supa
      .from('posts_v2')
      .select(this.postColumns, { count: 'exact' })
      .order('created_at', { ascending: true });
    if (championId) {
      query.eq('champion_id', championId);
    }
    const response: any = await query;
    const data = { posts: response.data as Post[], count: response.count || 0 };
    this.cacheService.set(cacheKeys, data);
    return data;
  }

  async fetchResponses(id: string, _for: 'champion' | 'post') {
    const cacheKeys = ['db', 'responses', _for, id];
    const cachedResponses = this.cacheService.get(cacheKeys);
    if (cachedResponses && this.newPosts === 0) return cachedResponses;
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
    const data = {
      responses: response.data as Post[],
      count: response.count || 0,
    };
    this.cacheService.set(cacheKeys, data);
    return data;
  }

  async fetchQuotes(id: string, _for: 'champion' | 'post') {
    const cacheKeys = ['db', 'quotes', _for, id];
    const cachedQuotes = this.cacheService.get(cacheKeys);
    if (cachedQuotes && this.newPosts === 0) return cachedQuotes;
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
    const data = {
      quotes: response.data as Post[],
      count: response.count || 0,
    };
    this.cacheService.set(cacheKeys, data);
    return data;
  }

  async fetchSinglePost(id: string) {
    let cacheKeys = ['db', 'posts', 'all'];
    const cachedPosts = this.cacheService.get(cacheKeys).posts as Post[];
    if (cachedPosts && this.newPosts === 0) {
      const cachedPost = cachedPosts.find((e) => e.id === id);
      if (cachedPost) return cachedPost;
    }
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
