export default interface IBaseRepository<T>{
  create(item:Partial<T>):Promise<T>,
  update(id:string,item:Partial<T>):Promise< T | null >,
  findById(id:string):Promise<T|null>,
  findAll(filter?:Partial<T>):Promise<T[]|null>,
  findOne(filter?:Partial<T>):Promise<T|null>,
  deleteById(id:string):Promise<void>,
}