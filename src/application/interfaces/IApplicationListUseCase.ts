import { ListApplicationsDTO } from "../dtos/admin.dto";

export interface ApplicationListResponse {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  specializations: string[];
}
export default interface IApplicationListUseCase {
  execute(dto: ListApplicationsDTO): Promise<ApplicationListResponse[]>;
}
