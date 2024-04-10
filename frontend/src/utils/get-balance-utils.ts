import {BalanceService} from "../services/balance-service";
import {BalanceResponseType} from "../types/balance-response.type";

export class GetBalanceUtils {
    public static async getBalance(openNewRoute: (url: string) => Promise<void>): Promise<void | null> {
        const response: BalanceResponseType = await BalanceService.getBalance();
        const userBalanceElement: HTMLElement | null = document.getElementById('user-balance');
        if (response.error) {
            alert(response.error);
            return response.redirect ? openNewRoute(response.redirect) : null;
        }

        if (userBalanceElement) userBalanceElement.innerText = response.balance + '$';
    }
}
