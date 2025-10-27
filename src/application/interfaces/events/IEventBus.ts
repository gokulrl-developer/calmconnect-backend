import { EventMap } from "./EventMap";

export interface IEventBus {
  subscribe<K extends keyof EventMap>(
    eventName: K,
    callback: (payload: EventMap[K]) => Promise<void> | void
  ): void;

  emit<K extends keyof EventMap>(
    eventName: K,
    payload: EventMap[K]
  ): Promise<void>;
}
