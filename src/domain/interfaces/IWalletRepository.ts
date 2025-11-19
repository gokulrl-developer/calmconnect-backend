import Wallet from "../entities/wallet.entity.js";
import IBaseRepository from "./IBaseRepository.js";

export default interface IWalletRepository extends IBaseRepository<Wallet>{
    findByOwner(ownerId:string,ownerType:"platform"|"user"|"psychologist"):Promise<Wallet|null>,
}