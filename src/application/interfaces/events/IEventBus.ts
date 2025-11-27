import { EventMap } from "./EventMap.js";

export interface IEventBus{
  subscribe<K extends keyof EventMap>(
    eventName: K,
    callback: (payload: EventMap[K]) => void | Promise<void>
  ): void;

  emit<K extends keyof EventMap>(
    eventName: K,
    payload: EventMap[K]
  ): Promise<void>;
}
