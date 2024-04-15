import config from "../config/config";
import {UserInfoType} from "../types/user-info.type";
import {RefreshResponseType, TokensType} from "../types/tokens.type";
import {DefaultResponseType} from "../types/default-response.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    public static getAuthInfo(key: string | null = null): string | null {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return null;
        }
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let refreshResult: boolean = false;
        const tokenForRefresh: string | null = this.getAuthInfo(this.refreshTokenKey);

        if (tokenForRefresh) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: tokenForRefresh})
            });

            if (response && response.status === 200) {
                const result: RefreshResponseType | DefaultResponseType = await response.json();

                if ((result as DefaultResponseType).error !== undefined) {
                    throw new Error((result as DefaultResponseType).message);
                }

                const tokens: TokensType = (result as RefreshResponseType).tokens;

                if (tokens && tokens.accessToken && tokens.refreshToken) {
                    this.setAuthInfo(tokens.accessToken, tokens.refreshToken);
                    refreshResult = true;
                }
            }
        }

        if (!refreshResult) {
            this.removeAuthInfo();
        }

        return refreshResult;
    }
}
