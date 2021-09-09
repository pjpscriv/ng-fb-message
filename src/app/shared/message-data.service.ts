import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message } from '../types/message.interface';
import { Thread } from '../types/thread.interface';
import { UpdateLoadProgressAction, UpdateMessagesAction, UpdateThreadsAction } from '../store/app.actions';
import { selectLoadProgress } from '../store/app.selectors';
import { AppState } from '../store/app.state';
import * as d3 from 'd3';
import { nest } from 'd3-collection';

@Injectable({
  providedIn: 'root'
})
export class MessageDataService {

  private messageArray: Array<Message> = [];

  constructor(private store: Store<AppState>) {}

  public addMessage(message: Message): void {
    this.messageArray.push(message);
  }

  public addThreads(threads: Array<Thread>): void {
    this.store.dispatch(UpdateThreadsAction({ threads }));
  }

  public setProgress(value: number, total: number): void {
    const cent = Math.floor(total / 100);
    if (value % cent === 0) {
      const loadProgress = Math.floor((value / total) * 100);
      this.store.dispatch(UpdateLoadProgressAction({ loadProgress }));
    }
  }

  public resetProgress(): void {
    this.store.dispatch(UpdateLoadProgressAction({ loadProgress: 0 }));
  }

  public getProgress(): Observable<number> {
    return this.store.pipe(select(selectLoadProgress));
  }

  public messagesLoaded(): void {
    // TODO: Find a better way of doing this, this is horribly inefficient
    const username = this.getUsername();
    this.messageArray.forEach((m: Message) => m.is_user = m.sender_name === username);

    this.store.dispatch(UpdateLoadProgressAction({ loadProgress: 100 }));
    this.store.dispatch(UpdateMessagesAction({messages: this.messageArray }));
    this.messageArray = [];
  }

  private getUsername(): string {
    // Identify the username of the user based on the user who appears in the most threads
    let threadsPerUser = nest()
      .key((d: any) => d.sender_name)
      .key((d: any) => d.thread)
      .rollup((leaves: any) => leaves.length)
      .entries(this.messageArray);

    threadsPerUser = threadsPerUser.sort((x, y) => d3.descending(x.values[0].value, y.values[0].value));

    return threadsPerUser[0].key;
  }
}
