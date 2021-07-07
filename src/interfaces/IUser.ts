export interface IUser {
    email: string;
    password: string; 
    nickname: string;
    cafeti?: string;
    profileImg?: string;
    created_at?: Date;
    deleted_at?: Date;
}

export interface IUserOutputDTO {
    email: string;
    password: string;
    nickname: string;
    cafeti?: string;
    profileImg?: string;
}

export interface IUserReviewDTO {
    _id: string;
    nickname: string;
    progileImg?: string;
}