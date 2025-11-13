import { FetchDashboardSummaryCardsDTO } from "../dtos/admin.dto";

export interface SummaryCardItem{
    totalValue:number; // all time total
    addedValue:number; // added in the time range
}

export interface DashboardSummaryCardResponse{
    users:SummaryCardItem;
    psychologists:SummaryCardItem;
    sessions:SummaryCardItem;
    revenue:SummaryCardItem;
}
export default interface IFetchDashboardSummaryCardsAdminUseCase{
    execute(dto:FetchDashboardSummaryCardsDTO):Promise<DashboardSummaryCardResponse>
}