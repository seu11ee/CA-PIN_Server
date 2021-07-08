import {ICafeti} from "../interfaces/ICafeti";
export interface IUser {
    email: string;
    password: string; 
    nickname: string;
    cafeti?: ICafeti;
    profileImg?: string;
    created_at?: Date;
    deleted_at?: Date;
}

export interface IUserOutputDTO {
    email: string;
    password: string;
    nickname: string;
    cafeti?: ICafeti;
    profileImg?: string;
}