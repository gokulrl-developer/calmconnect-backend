import Wallet from "../entities/wallet.entity.js";
import { WalletOwnerType } from "../enums/WalletOwnerType.js";
import IBaseRepository from "./IBaseRepository.js";

export default interface IWalletRepository extends IBaseRepository<Wallet>{
    findByOwner(ownerId:string,ownerType:WalletOwnerType):Promise<Wallet|null>,
}