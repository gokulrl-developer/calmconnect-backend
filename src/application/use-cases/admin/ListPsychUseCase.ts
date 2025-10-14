import { ListPsychDTO } from "../../dtos/admin.dto";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import IPsychListUseCase from "../../interfaces/IPsychListUseCase";
import { toAdminPsychListResponse } from "../../mappers/PsychMapper";

export class PsychListUseCase implements IPsychListUseCase {
constructor(private readonly _psychRepository: IPsychRepository) {}


async execute(dto: ListPsychDTO): Promise<any[]> {
const psychs = await this._psychRepository.findList(dto);
return psychs.map(psych => toAdminPsychListResponse(psych));
}
}