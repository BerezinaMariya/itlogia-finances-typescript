import {HttpUtils} from "../utils/http-utils";
import {
    OperationCreateType,
    OperationGetType,
    OperationRequestDataType,
    OperationsType,
    OperationType
} from "../types/operations.type";
import {DateResponseType} from "../types/date-response.type";
import {HttpRequestType} from "../types/http-request.type";

export class OperationsService {
    public static async getOperations(date: DateResponseType): Promise<OperationsType> {
        const returnObject: OperationsType = {
            error: null,
            redirect: null,
            operations: []
        };

        let responseDate: string = '';

        if (date.hasOwnProperty('period')) {
            responseDate = '?period=' + date.period;
        } else if (date.interval && date.hasOwnProperty('interval')) {
            responseDate = '?period=interval&dateFrom=' + date.interval.from + '&dateTo=' + date.interval.to;
        }

        const result: HttpRequestType = await HttpUtils.request('/operations' + responseDate);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе доходов/расходов. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operations = result.response;
        return returnObject;
    }

    public static async getOperation(id: number): Promise<OperationGetType> {
        const returnObject: OperationGetType = {
            error: null,
            redirect: null,
            operation: null
        };

        const result: HttpRequestType = await HttpUtils.request('/operations/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе дохода/расхода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operation = result.response;
        return returnObject;
    }

    public static async createOperation(data: OperationRequestDataType): Promise<OperationCreateType> {
        const returnObject: OperationCreateType = {
            error: null,
            redirect: null,
            id: null
        };

        const result: HttpRequestType = await HttpUtils.request('/operations', 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при добавлении дохода/расхода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }

    public static async updateOperation(id: number, data: OperationRequestDataType): Promise<OperationType> {
        const returnObject: OperationType = {
            error: null,
            redirect: null
        };

        const result: HttpRequestType = await HttpUtils.request('/operations/' + id, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании дохода/расхода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    public static async deleteOperation(id: number): Promise<OperationType> {
        const returnObject: OperationType = {
            error: null,
            redirect: null
        };

        const result: HttpRequestType = await HttpUtils.request('/operations/' + id, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении дохода/расхода. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}
