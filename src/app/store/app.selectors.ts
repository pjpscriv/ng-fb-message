import { createSelector } from '@ngrx/store';
import { Crossfilter } from '../types/crossfilter.aliases';
import { Message } from '../types/message.interface';
import { ThreadMap } from '../types/thread.interface';
import { AppState } from './app.state';

export const selectMessageData = createSelector(
  (state: AppState) => state.messageData,
  (messages: Crossfilter<Message>) => messages
);

export const selectChartData = createSelector(
  (state: AppState) => state.chartData,
  (messages: Crossfilter<Message>) => messages
);

export const selectLoadProgress = createSelector(
  (state: AppState) => state.loadProgress,
  (loadProgress: number) => loadProgress
);

export const selectThreads = createSelector(
  (state: AppState) => state.threads,
  (threads: ThreadMap) => threads
);

export const selectDarkMode = createSelector(
  (state: AppState) => state.darkMode,
  (darkMode: boolean) => darkMode
);
