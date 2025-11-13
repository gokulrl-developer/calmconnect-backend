import { FetchSessionTrendsDTO } from "../dtos/admin.dto";

export interface SessionTrendsEntry {
  label: string;     // day or month   
  sessions:number;
  cancelledSessions:number;
}

export default interface IFetchSessionTrendsUseCase{
  execute(dto: FetchSessionTrendsDTO): Promise<SessionTrendsEntry[]>;
}
