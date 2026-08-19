import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { from, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { PersistanceService } from './persistance.service';

const PUSH_PROMPT_SHOWN = 'PUSH_PROMPT_SHOWN';

@Injectable()
export class PushNotificationService {
  constructor(
    private swPush: SwPush,
    private http: HttpClient,
    private persister: PersistanceService
  ) {}

  shouldPrompt(): boolean {
    if (!this.swPush.isEnabled) {
      return false;
    }
    if (typeof Notification === 'undefined' || Notification.permission !== 'default') {
      return false;
    }
    return this.persister.get(PUSH_PROMPT_SHOWN) !== true;
  }

  markPromptShown(): void {
    this.persister.set(PUSH_PROMPT_SHOWN, true);
  }

  subscribeToNotifications(personaid?: string): Observable<any> {
    if (!this.swPush.isEnabled) {
      return throwError(() => new Error('Service Worker non disponibile (usa una build production/PWA).'));
    }

    const baseUrl = window.location.origin;
    return from(
      this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey,
      })
    ).pipe(
      switchMap((sub) => {
        const json = sub.toJSON();
        return this.http.post(`${baseUrl}/.netlify/functions/subscribe-push`, {
          endpoint: json.endpoint,
          keys: json.keys,
          personaid: personaid || null,
        });
      })
    );
  }

  sendExampleNotification(): Observable<any> {
    const baseUrl = window.location.origin;
    return this.http.post(`${baseUrl}/.netlify/functions/send-push`, {
      title: 'GsApp',
      body: 'Notifica di esempio',
    });
  }
}
