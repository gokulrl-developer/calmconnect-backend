export interface ListPsychQueryByUser{
specialization:string |null,
gender:string|null,
language:string|null,
date:string|null,
sort:"a-z"|"z-a"|"rating"|"price",  /* a-z,z-a,rating,price */
search:string |null,/* name,specializations,languages fields */
skip:number,
limit:number
}