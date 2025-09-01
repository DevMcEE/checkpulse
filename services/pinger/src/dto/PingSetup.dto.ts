import type { HostType } from '../types/host.types';
import type { Notification } from '../types/ping-setup.types';

export class PingSetup {
  target: HostType | null;
  timeout: number | null;
  responseCode: number | null;
  contentType: string | null;
  startTime: Date | null;
  period: number | null;
  incedentThreshold: number | null;
  recoveryThreshold: number | null;
  notificationChannels: Notification[] | null;

  constructor({
    target,
    timeout,
    responseCode,
    contentType,
    startTime,
    period,
    incedentThreshold,
    recoveryThreshold,
    notificationChannels,
  }: PingSetup) {
    this.target = target || null;
    this.timeout = timeout || null;
    this.responseCode = responseCode || null;
    this.contentType = contentType || null;
    this.startTime = startTime || null;
    this.period = period || null;
    this.incedentThreshold = incedentThreshold || null;
    this.recoveryThreshold = recoveryThreshold || null;
    this.notificationChannels = notificationChannels || null;
  }
}
