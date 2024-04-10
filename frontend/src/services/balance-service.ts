import {HttpUtils} from "../utils/http-utils";
import {BalanceResponseType} from "../types/balance-response.type";
import {HttpRequestType} from "../types/http-request.type";

export class BalanceService {
    public static async getBalance(): Promise<BalanceResponseType> {
        const returnObject: BalanceResponseType = {
            error: null,
            redirect: null,
            balance: null
        };

        const result: HttpRequestType = await HttpUtils.request('/balance');

        if (result.redirect || result.error || !result.response) {
            returnObject.error = 'Возникла ошибка при запросе заказов. Обратитесь в поддержку';
            result.redirect ? returnObject.redirect = result.redirect : null;
            return returnObject;
        }

        returnObject.balance = result.response.balance;
        return returnObject;
    }
}
