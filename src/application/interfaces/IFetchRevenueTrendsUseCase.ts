import { FetchRevenueTrendsDTO } from "../dtos/admin.dto.js";

export interface RevenueTrendsEntry {
  label: string;       //  day or month    
  revenue: number;
}

export default interface IFetchRevenueTrendsUseCase {
  execute(dto: FetchRevenueTrendsDTO): Promise<RevenueTrendsEntry[]>;
}
