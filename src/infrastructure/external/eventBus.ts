type EventCallback<T = any> = (payload: T) => Promise<void> | void;

export default class EventBus {
  private listeners: Map<string, EventCallback[]>;

  constructor() {
    this.listeners = new Map<string, EventCallback[]>();
  }

  subscribe(eventName: string, callback: EventCallback): void {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, []);
    this.listeners.get(eventName)!.push(callback);
  }

  async emit<T = any>(eventName: string, payload: T): Promise<void> {
    const callbacks = this.listeners.get(eventName) || [];
    for (const cb of callbacks) {
            await cb(payload);
    }
  }
}

export const eventBus = new EventBus();

