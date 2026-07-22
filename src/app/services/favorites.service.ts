import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private ids = new BehaviorSubject<string[]>([]);
  ids$ = this.ids.asObservable();
}
