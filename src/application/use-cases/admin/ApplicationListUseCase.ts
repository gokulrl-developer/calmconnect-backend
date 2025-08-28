import { ListApplicationsDTO } from "../../../domain/dtos/admin.dto";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository";
import IApplicationListUseCase, { ApplicationListResponse } from "../../interfaces/IApplicationListUseCase";
import { toAdminApplicationListResponse } from "../../mappers/ApplicationMapper";


export default class ApplicationListUseCase implements IApplicationListUseCase {
  constructor(private readonly _applicationRepository: IApplicationRepository) {}

  async execute(dto: ListApplicationsDTO): Promise<ApplicationListResponse[]> {
    const page=dto.page;
    const limit=10;
    const skip=(page-1)*10
    const applications = await this._applicationRepository.findPendingApplications(skip,limit,dto.search);
    return applications.map(app => toAdminApplicationListResponse(app));
  }
}
