import {CategoriesService} from "../../services/categories-service";
import {UrlUtils} from "../../utils/url-utils";
import {CategoryType} from "../../types/categories.type";

export class CategoriesDelete {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly category: string;

    constructor(openNewRoute: (url: string) => Promise<void>, category: string) {
        this.openNewRoute = openNewRoute;
        this.category = category;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/').then();
            return;
        }

         this.deleteCategory(parseInt(id)).then();
    }

    private async deleteCategory(id: number): Promise<void | null> {
        const response: CategoryType = await CategoriesService.deleteCategory(id, this.category);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/' + this.category);
    }
}
