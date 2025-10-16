import { PsychApplicationDTO } from "../dtos/psych.dto"
import { Application} from "../../domain/entities/application.entity"
import Psychologist from "../../domain/entities/psychologist.entity"
import { PsychApplication } from "../interfaces/IFetchLatestApplicationByPsychUseCase"

export interface FileStorageReturn{
    profilePicture:string,
    licenseUrl:string,
    resume:string
}
export const toApplicationDomainSubmit=(application:PsychApplicationDTO,psychologist:Psychologist,urls:FileStorageReturn)=>{
    return new Application(
    application.psychId,
    psychologist.firstName,
    psychologist.lastName,
    psychologist.email,
    psychologist.isVerified,
    application.submittedAt, 
    application.phone, 
    application.gender,
    application.dob,
    urls.profilePicture,
    application.address,
    0,
    application.languages,
    application.specializations,
    application.bio,
    urls.licenseUrl,
    urls.resume,
    application.qualifications,
    "pending",
    undefined,
    psychologist.password,
    undefined,    
     undefined,
     undefined,
    undefined
    );
}


export const toApplicationStatusResponse=(application:Application|null)=>{
    if(!application ||!application.status){
        return {status:null}
    }else{
        return{
  status:application.status
        }}
}

export const toAdminApplicationListResponse=(application:Application)=>{
  return{  
    id:application.id,
    firstName:application.firstName,
    lastName:application.lastName,
  email:application.email,
  status:application.status,
  specializations:application.specializations
  }

}

export const toApplicationDetails=(application:Application)=>{
    return {
    firstName:application.firstName,
    lastName:application.lastName,
    email:application.email,
    submittedAt:application.submittedAt, 
    phone:application.phone?? null, 
    gender:application.gender,
    dob:application.dob,
    profilePicture:application.profilePicture,
    address:application.address,
    languages:application.languages,
    specializations:application.specializations,
    bio:application.bio,
    licenseUrl:application.licenseUrl,
    resume:application.resume,
    qualifications:application.qualifications,
    status:application.status,
    }
}


export const toPsychApplicationResponse = (app: Application | null): PsychApplication|null => {
    if(app===null){
        return null;
    }
  return {
    submittedAt: app.submittedAt!,
    phone: app.phone ?? "",
    gender: app.gender as "male" | "female" | "others",
    dob: app.dob!,
    profilePicture: app.profilePicture ?? "",
    address: app.address ?? "",
    languages: app.languages ?? "",
    specializations: app.specializations ?? [],
    bio: app.bio ?? "",
    license: app.licenseUrl ?? "",
    resume: app.resume ?? "",
    qualifications: app.qualifications ?? "",
    reason:app.rejectionReason!
  };
};
