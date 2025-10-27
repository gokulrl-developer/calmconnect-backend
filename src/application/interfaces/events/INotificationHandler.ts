import { IEventBus } from "./IEventBus";

export default interface INotificationHandler {
  subscribe(eventBus: IEventBus): void;
}
