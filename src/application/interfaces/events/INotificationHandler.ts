import { IEventBus } from "./IEventBus.js";

export default interface INotificationHandler {
  subscribe(eventBus: IEventBus): void;
}
