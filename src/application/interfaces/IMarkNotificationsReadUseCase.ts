import { MarkNotificationsReadDTO } from "../dtos/shared.dto";

export default interface IMarkNotificationsReadUseCase {
  execute(dto: MarkNotificationsReadDTO): Promise<void>;
}
