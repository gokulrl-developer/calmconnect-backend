import Wallet from "../entities/wallet.entity";
import IBaseRepository from "./IBaseRepository";

export default interface IWalletRepository extends IBaseRepository<Wallet>{
  
}