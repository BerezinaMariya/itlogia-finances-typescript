import {UserInfoType} from "./user-info.type";
import {TokensType} from "./tokens.type";

export type LoginResponseType = {
    tokens: TokensType,
    user: UserInfoType
}