import {ValidationUtils} from "../../utils/validation-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {ValidationItemType} from "../../types/validation-item.type";
import {SignupResponseType} from "../../types/signup-response.type";
import {LoginResponseType} from "../../types/login-response.type";

export class Signup {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly validations: ValidationItemType[] = [];
    private fullNameElement: HTMLInputElement | null = null;
    private emailElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private passwordRepeatElement: HTMLInputElement | null = null;
    private commonErrorElement: HTMLElement | null = null;
    private processButton: HTMLElement | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        this.findElements();

        if (this.fullNameElement && this.emailElement && this.passwordElement && this.passwordRepeatElement) {
            this.validations = [
                {element: this.fullNameElement, options: {pattern: /^([А-ЯЁ][а-яё]+\s){2}([А-ЯЁ][а-яё]+)$/}},
                {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
                {element: this.passwordElement, options: {pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/}},
                {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
            ];
        }

        if (this.processButton) this.processButton.addEventListener('click', this.signUp.bind(this));
    }

    private findElements(): void {
        this.fullNameElement = document.getElementById('full-name') as HTMLInputElement | null;
        this.emailElement = document.getElementById('email') as HTMLInputElement | null;
        this.passwordElement = document.getElementById('password') as HTMLInputElement | null;
        this.passwordRepeatElement = document.getElementById('password-repeat') as HTMLInputElement | null;
        this.commonErrorElement = document.getElementById('common-error');
        this.processButton = document.getElementById('process-button');
    }

    private async signUp(e: Event): Promise<void> {
        e.preventDefault();

        if (!this.fullNameElement || !this.fullNameElement || !this.emailElement || !this.passwordElement || !this.passwordRepeatElement) {
            return;
        }

        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';

            for (let i = 0; i < this.validations.length; i++) {
                if (this.validations[i].element === this.passwordRepeatElement) {
                    if (this.validations[i].options?.compareTo  && this.passwordElement) this.passwordElement.value;
                }
            }

            if (ValidationUtils.validateForm(this.validations)) {
                const signupResult: SignupResponseType | boolean = await AuthService.signUp({
                    name: this.fullNameElement.value.split(' ')[0],
                    lastName: this.fullNameElement.value.split(' ')[1],
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.passwordRepeatElement.value
                });

                if (signupResult) {
                    const loginResult: LoginResponseType | boolean = await AuthService.logIn({
                        email: this.emailElement.value,
                        password: this.passwordElement.value,
                        rememberMe: false
                    }) as LoginResponseType;

                    if (loginResult) {
                        AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                            id: loginResult.user.id,
                            name: loginResult.user.name,
                            lastName: loginResult.user.lastName
                        });
                    }

                    return this.openNewRoute('/');
                }

                this.commonErrorElement.style.display = 'block';
            }
        }
    }
}
