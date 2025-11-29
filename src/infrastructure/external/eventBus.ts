import { EventMap } from "../../application/interfaces/events/EventMap.js";
import { IEventBus } from "../../application/interfaces/events/IEventBus.js";

type EventCallback<T> = (payload: T) => void | Promise<void>;

export class EventBus implements IEventBus{
  private listeners: {
    [K in keyof EventMap]?: EventCallback<EventMap[K]>[];
  } = {};

  subscribe<K extends keyof EventMap>(eventName: K, callback: EventCallback<EventMap[K]>): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName]!.push(callback);
  }

  async emit<K extends keyof EventMap>(eventName: K, payload: EventMap[K]): Promise<void> {
    const callbacks = this.listeners[eventName] ?? [];
    for (const cb of callbacks) {
      await cb(payload);
    }
  }
}

export const eventBus = new EventBus();
