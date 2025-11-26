
export interface IEventBus<EM> {
  subscribe<K extends keyof EM>(
    eventName: K,
    callback: (payload: EM[K]) => void | Promise<void>
  ): void;

  emit<K extends keyof EM>(
    eventName: K,
    payload: EM[K]
  ): Promise<void>;
}
