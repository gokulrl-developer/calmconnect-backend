import { PostMessageDTO } from "../dtos/shared.dto.js";
import { GetMessageResponse } from "./IGetMessagesUseCase.js";

export default interface IPostMessageUseCase{
    execute(dto:PostMessageDTO):Promise<GetMessageResponse>
}