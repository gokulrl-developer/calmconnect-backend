import { ListPsychDTO } from "../../dtos/admin.dto.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import IPsychListUseCase from "../../interfaces/IPsychListUseCase.js";
import { toAdminPsychListResponse } from "../../mappers/PsychMapper.js";

export class PsychListUseCase implements IPsychListUseCase {
constructor(private readonly _psychRepository: IPsychRepository) {}


async execute(dto: ListPsychDTO): Promise<any[]> {
const psychs = await this._psychRepository.findList(dto);
return psychs.map(psych => toAdminPsychListResponse(psych));
}
}