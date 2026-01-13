import { FetchClientTrendsDTO } from "../dtos/admin.dto.js";

export interface ClientTrendsEntry {
  label: string;     // day or month   
  userCount:number;
  psychologistCount:number;
}

export default interface IFetchClientsTrendsUseCase {
  execute(dto: FetchClientTrendsDTO): Promise<ClientTrendsEntry[]>;
}
