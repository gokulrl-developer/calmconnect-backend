import { MarkNotificationsReadDTO } from "../dtos/shared.dto.js";

export default interface IMarkNotificationsReadUseCase {
  execute(dto: MarkNotificationsReadDTO): Promise<void>;
}
