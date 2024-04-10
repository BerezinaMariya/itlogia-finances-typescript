import {CategoriesService} from "../../services/categories-service";
import {CategoryCreateType} from "../../types/categories.type";
import {CategoryNamesType} from "../../types/category-names.type";

export class CategoriesCreate {
    readonly openNewRoute: (url: string) => Promise<void>;
    private category: CategoryNamesType;
    private categoryTitleInputElement: HTMLInputElement | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>, category: CategoryNamesType) {
        this.openNewRoute = openNewRoute;
        this.category = category;

        console.log(this.category);

        this.findElements();

        const saveButton: HTMLElement | null = document.getElementById('save-button');
        if (saveButton) {
            saveButton.addEventListener('click', this.saveIncome.bind(this));
        }
    }

    private findElements(): void {
        this.categoryTitleInputElement = document.getElementById('category-title-input') as HTMLInputElement | null;
    }

    private async saveIncome(): Promise<void | null> {
        if (!this.categoryTitleInputElement) return;

        const createData: { title: string } = {
            title: this.categoryTitleInputElement.value,
        }

        if (this.categoryTitleInputElement.value)  {
            const response: CategoryCreateType = await CategoriesService.createCategory(createData, this.category);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/' + this.category);
        }
    }

}
