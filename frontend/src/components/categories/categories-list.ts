import {CategoriesService} from "../../services/categories-service";
import {ShowCategoriesRecordsUtils} from "../../utils/show-categories-records-utils";
import {CategoriesType} from "../../types/categories.type";

export class CategoriesList {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly category: string;

    constructor(openNewRoute: (url: string) => Promise<void>, category: string) {
        this.openNewRoute = openNewRoute;
        this.category = category;
        this.getCategories().then();
    }

    private async getCategories(): Promise<void | null> {
        if (!this.category) return;

        const response: CategoriesType = await CategoriesService.getCategories(this.category);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        ShowCategoriesRecordsUtils.showRecords(response.categories, this.category);
    }
}
