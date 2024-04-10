import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";

export class Logout {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly refreshToken: string | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !this.refreshToken) {
            this.openNewRoute('/login').then();
            return;
        }

        this.logout().then();
    }

    private async logout(): Promise<void> {
        if (this.refreshToken) {
            await AuthService.logOut({refreshToken: this.refreshToken});
            AuthUtils.removeAuthInfo();
        }

        return this.openNewRoute('/login');
    }
}
