import Transaction from "../entities/transaction.entity";
import IBaseRepository from "./IBaseRepository";

export default interface ITransactionRepository extends IBaseRepository<Transaction>{
  
}