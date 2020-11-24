import { Injectable } from '@angular/core';
import { IHero } from '../interfaces/hero.interface';
import { Heroes } from '../fakeServer/mock-heroes'
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HeroService {
  private heroesUrl = 'api/heroes';

  constructor(private messageService: MessageService,
              private http: HttpClient) { }

  getHeroes(): Observable<Array<IHero>> {
    return this.http.get<Array<IHero>>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Array<IHero>>('getHeroes', []))
      );
  }

  getHero(id: number): Observable<IHero> {
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(Heroes.find(hero => hero.id === id));
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
