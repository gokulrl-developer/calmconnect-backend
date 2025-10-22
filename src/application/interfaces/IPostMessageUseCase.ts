import { PostMessageDTO } from "../dtos/shared.dto";
import { GetMessageResponse } from "./IGetMessagesUseCase";

export default interface IPostMessageUseCase{
    execute(dto:PostMessageDTO):Promise<GetMessageResponse>
}