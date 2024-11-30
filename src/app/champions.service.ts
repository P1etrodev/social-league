import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Champion, PartialChampion } from 'src/models/champion.model';
import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChampionsService {
  private client = inject(HttpClient);
  private version = '14.23.1';
  champions = new Array<PartialChampion>();

  private selectedChampionSubject = new BehaviorSubject<PartialChampion | null>(
    null
  );
  selectedChampion$ = this.selectedChampionSubject.asObservable();

  constructor() {
    this.client
      .get(
        `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/es_AR/champion.json`
      )
      .subscribe({
        next: ({ data }: any) => {
          this.champions = Object.values(data).map(
            (champInfo) => this.parseChampionInfo(champInfo) as PartialChampion
          );
        },
      });
  }

  private parseChampionInfo(champInfo: any) {
    return {
      id: champInfo.id,
      name: champInfo.name,
      title: champInfo.title,
      blurb: champInfo.blurb,
      lore: champInfo.lore,
      tags: champInfo.tags,
      info: {
        attack: champInfo.info.attack,
        defense: champInfo.info.defense,
        magic: champInfo.info.magic,
        difficulty: champInfo.info.difficulty,
      },
      passive: champInfo.passive,
      spells: champInfo.spells,
      skins: champInfo.skins?.slice(1).map((e: any): number => e.num),
    } as Champion;
  }

  async getFullChampion(championId: string) {
    // URL base de la API
    const url = `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/es_AR/champion/${championId}.json`;

    // Esperamos el primer valor emitido por el observable
    const { data }: any = await firstValueFrom(this.client.get(url));

    const champInfo = data[championId];
    // Mapeamos los datos al modelo Champion
    return this.parseChampionInfo(champInfo) as Champion;
  }

  get selectedChampion() {
    return this.selectedChampionSubject.value as Champion;
  }

  setSelectedChampion(champion: PartialChampion): void {
    this.selectedChampionSubject.next(champion);
    localStorage.setItem('current-champion', JSON.stringify(champion));
  }

  // Inicializa el estado desde localStorage si existe
  initializeChampion(champions: PartialChampion[]): void {
    const storedChampion = localStorage.getItem('current-champion');
    if (storedChampion) {
      this.selectedChampionSubject.next(JSON.parse(storedChampion));
    } else if (champions.length > 0) {
      this.setSelectedChampion(champions[0]);
    }
  }

  getIcon(championId: string) {
    return `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${championId}.png`;
  }

  getLoading(championId: string, skinNumber?: number) {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_${
      skinNumber || 0
    }.jpg`;
  }

  getSplash(championId: string, skinNumber?: number) {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${
      skinNumber || 0
    }.jpg`;
  }

  getSkill(skill: string, isPassive: boolean) {
    if (isPassive)
      return (
        `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/passive/` +
        skill
      );
    return (
      `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/spell/` +
      skill
    );
  }
}
