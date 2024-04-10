import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {AuthUtils} from "../../utils/auth-utils";
import {ValidationItemType} from "../../types/validation-item.type";
import {LoginResponseType} from "../../types/login-response.type";

export class Login {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly validations: ValidationItemType[] = [];
    private emailElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private rememberMeElement: HTMLInputElement | null = null;
    private commonErrorElement: HTMLElement | null = null;
    private processButton: HTMLElement | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        this.findElements();

        if (this.emailElement && this.passwordElement) {
            this.validations = [
                {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
                {element: this.passwordElement},
            ];
        }

        if (this.processButton) {
            this.processButton.addEventListener('click', this.login.bind(this));
        }
    }

    private findElements(): void {
        this.emailElement = document.getElementById('email') as HTMLInputElement | null;
        this.passwordElement = document.getElementById('password') as HTMLInputElement | null;
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement | null;
        this.commonErrorElement = document.getElementById('common-error');
        this.processButton = document.getElementById('process-button');
    }

    async login(e: Event): Promise<void> {
        e.preventDefault();

        if (!this.emailElement || !this.passwordElement || !this.rememberMeElement) {
            return;
        }

        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';

            if (ValidationUtils.validateForm(this.validations)) {
                const loginResult: LoginResponseType | boolean = await AuthService.logIn({
                    email: (this.emailElement as HTMLInputElement).value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                });

                if (loginResult) {
                    AuthUtils.setAuthInfo((loginResult as LoginResponseType).tokens.accessToken, (loginResult as LoginResponseType).tokens.refreshToken, {
                        id: (loginResult as LoginResponseType).user.id,
                        name: (loginResult as LoginResponseType).user.name,
                        lastName: (loginResult as LoginResponseType).user.lastName
                    });

                    this.openNewRoute('/').then();
                    return;
                }

                this.commonErrorElement.style.display = 'block';
            }
        }
    }
}
