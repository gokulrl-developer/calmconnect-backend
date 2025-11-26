import { EventMap } from "../../application/interfaces/events/EventMap.js";
import { IEventBus } from "../../application/interfaces/events/IEventBus.js";

type EventCallback<T> = (payload: T) => void | Promise<void>;

export class EventBus<EM> implements IEventBus<EM>{
  private listeners: {
    [K in keyof EM]?: EventCallback<EM[K]>[];
  } = {};

  subscribe<K extends keyof EM>(eventName: K, callback: EventCallback<EM[K]>): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName]!.push(callback);
  }

  async emit<K extends keyof EM>(eventName: K, payload: EM[K]): Promise<void> {
    const callbacks = this.listeners[eventName] ?? [];
    for (const cb of callbacks) {
      await cb(payload);
    }
  }
}

export const eventBus = new EventBus<EventMap>();
