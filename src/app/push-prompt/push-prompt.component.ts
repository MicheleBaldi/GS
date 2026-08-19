import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PushNotificationService } from '../service/push-notification.service';

@Component({
  selector: 'app-push-prompt',
  templateUrl: './push-prompt.component.html',
  styleUrls: ['./push-prompt.component.scss']
})
export class PushPromptComponent {
  @Input() personaid: string | null = null;
  busy = false;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private pushService: PushNotificationService
  ) {}

  attiva() {
    this.busy = true;
    this.errorMessage = '';
    this.pushService.subscribeToNotifications(this.personaid || undefined).subscribe({
      next: () => {
        this.pushService.markPromptShown();
        this.busy = false;
        this.activeModal.close(true);
      },
      error: (err) => {
        this.errorMessage = err?.error || err?.message || String(err);
        this.busy = false;
        this.pushService.markPromptShown();
      }
    });
  }

  nonOra() {
    this.pushService.markPromptShown();
    this.activeModal.dismiss(false);
  }
}
