import { ListApplicationsDTO } from "../../dtos/admin.dto.js";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository.js";
import IApplicationListUseCase, { ApplicationListResponse } from "../../interfaces/IApplicationListUseCase.js";
import { toAdminApplicationListResponse } from "../../mappers/ApplicationMapper.js";


export default class ApplicationListUseCase implements IApplicationListUseCase {
  constructor(private readonly _applicationRepository: IApplicationRepository) {}

  async execute(dto: ListApplicationsDTO): Promise<ApplicationListResponse[]> {
    const page=dto.page;
    const limit=10;
    const skip=(page-1)*10
    const applications = await this._applicationRepository.listApplications(skip,limit,dto.search,dto.status);
    return applications.map(app => toAdminApplicationListResponse(app));
  }
}
