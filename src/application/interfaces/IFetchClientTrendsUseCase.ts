import { FetchClientTrendsDTO } from "../dtos/admin.dto";

export interface ClientTrendsEntry {
  label: string;     // day or month   
  users:number;
  psychologists:number;
}

export default interface IFetchClientsTrendsUseCase {
  execute(dto: FetchClientTrendsDTO): Promise<ClientTrendsEntry[]>;
}
