import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-service";
import {OperationType} from "../../types/operations.type";
import * as events from "events";

export class OperationsDelete {
    readonly openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/').then();
            return;
        }

        this.deleteOperation(parseInt(id)).then();
    }

    private async deleteOperation(id: number): Promise<void | null> {
        const response: OperationType = await OperationsService.deleteOperation(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/operations');
    }
}
