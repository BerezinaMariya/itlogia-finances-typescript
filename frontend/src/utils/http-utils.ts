import config from "../config/config";
import {AuthUtils} from "./auth-utils";
import {HttpRequestType} from "../types/http-request.type";

export class HttpUtils {
    public static async request(url: string, method: string = 'GET', useAuth: boolean = true, body: any = null): Promise<HttpRequestType> {
        const result: HttpRequestType = {
            error: false,
            response: null
        }

        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        }

        let token: string | null = null;

        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);

            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response: Response | null = null;

        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;

            if (useAuth && response.status === 401) {
                if (!token) {
                    // 1 - токена нет
                    result.redirect = '/login';
                } else {
                    // 2 - токен устарел/невалидный (надо обновить)
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();

                    if (updateTokenResult) {
                        // запрос повторно
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }

        return result;
    }
}