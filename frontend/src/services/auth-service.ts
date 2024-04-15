import {HttpUtils} from "../utils/http-utils";
import {LoginResponseType} from "../types/login-response.type";
import {SignupResponseType} from "../types/signup-response.type";
import {HttpResponseType} from "../types/http-response.type";

export class AuthService {
    public static async logIn(data: {
        email: string,
        password: string,
        rememberMe: boolean
    }): Promise<LoginResponseType | boolean> {
        const result: HttpResponseType = await HttpUtils.request('/login', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.name || !result.response.user.lastName))) {
            return false;
        }

        return result.response;
    }

    public static async signUp(data: {
        name: string,
        lastName: string,
        email: string,
        password: string,
        passwordRepeat: string
    }): Promise<SignupResponseType | boolean> {
        const result: HttpResponseType = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.user.id || !result.response.user.name || !result.response.user.lastName))) {
            return false;
        }

        return result.response;
    }

    public static async logOut(data: {refreshToken: string}): Promise<void> {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}
