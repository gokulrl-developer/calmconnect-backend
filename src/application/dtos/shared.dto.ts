
export interface CheckSessionAccessDTO{
    sessionId:string,
    userId?:string,
    psychId?:string
}

export interface PostMessageDTO{
    sessionId:string,
    text:string,
    userId?:string,
    psychId?:string
}

export interface GetMessagesDTO{
    sessionId:string
}