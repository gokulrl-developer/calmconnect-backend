import Psychologist from "../../../domain/entities/psychologist.entity.js";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { ListPsychByUserDTO } from "../../dtos/user.dto.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IListPsychByUserUseCase from "../../interfaces/IListPsychByUserUseCase.js";
import {
  toPsychListByUserPersistence,
  toPsychListByUserResponse,
} from "../../mappers/PsychMapper.js";
import { calculatePagination } from "../../utils/calculatePagination.js";
import { getAvailableSlotsForDatePsych } from "../../utils/getAvailableSlotForDatePsych.js";

export default class ListPsychByUserUseCase implements IListPsychByUserUseCase {
  constructor(
    private readonly _psychRepository: IPsychRepository,
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _specialDayRepository: ISpecialDayRepository,
    private readonly _quickSlotsRepository: IQuickSlotRepository,
    private readonly _sessionRepository: ISessionRepository
  ) {}

  async execute(dto: ListPsychByUserDTO) {
    const filteredData = await this._psychRepository.listPsychByUser(
      toPsychListByUserPersistence(dto)
    );

    let psychologistsBeforeDateFilter = filteredData.psychologists;
    let psychologistsAfterDateFilter: Psychologist[] = [];

    if (dto.date) {
      const weekDay = new Date(dto.date).getDay();
      const selectedDate = new Date(dto.date);

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      if (startOfToday > selectedDate) {
        throw new AppError(
          ERROR_MESSAGES.SELECTED_DATE_PASSED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      const availabilityChecks = await Promise.all(
        psychologistsBeforeDateFilter.map(async (psych) => {
          const [availabilityRules, specialDay, quickSlots, sessions] =
            await Promise.all([
              this._availabilityRuleRepository.findActiveByWeekDayPsych(
                weekDay,
                psych.id!
              ),
              this._specialDayRepository.findActiveByDatePsych(
                selectedDate,
                psych.id!
              ),
              this._quickSlotsRepository.findActiveByDatePsych(
                selectedDate,
                psych.id!
              ),
              this._sessionRepository.findBookedSessions(
                selectedDate,
                psych.id!
              ),
            ]);

          const slotsCreated = getAvailableSlotsForDatePsych(
            specialDay,
            availabilityRules,
            quickSlots,
            sessions
          );

          return slotsCreated.length > 0 ? psych : null;
        })
      );

      psychologistsAfterDateFilter = availabilityChecks.filter(
        (p): p is Psychologist => p !== null
      );
    } else {
      psychologistsAfterDateFilter = psychologistsBeforeDateFilter;
    }

    const psychologists = psychologistsAfterDateFilter.map((psych) =>
      toPsychListByUserResponse(psych)
    );

    const paginationData = calculatePagination(
      filteredData.totalItems,
      dto.skip,
      dto.limit
    );

    return { psychologists, paginationData };
  }
}
