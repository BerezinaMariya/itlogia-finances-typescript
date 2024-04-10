import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";
import {CategoryGetType, CategoryResponseType, CategoryType} from "../../types/categories.type";
import {SelectOptionsUtils} from "../../utils/select-options-utils";

export class CategoriesEdit {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly category: string;
    private categoryOriginalData: CategoryResponseType | null = null;
    private categoryTitleInputElement: HTMLInputElement | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>, category: string) {
        this.openNewRoute = openNewRoute;
        this.category = category;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/').then();
            return;
        }

        this.findElements();
        this.init();
        this.getCategory(parseInt(id)).then();
    }

    private init(): void {
        const saveButton: HTMLElement | null = document.getElementById('save-button');
        if (saveButton) {
            saveButton.addEventListener('click', this.updateCategory.bind(this));
        }
    }

    private findElements(): void {
        this.categoryTitleInputElement = document.getElementById('category-title-input') as HTMLInputElement | null;
    }

    private async getCategory(id: number): Promise<void | null> {
        const response: CategoryGetType = await CategoriesService.getCategory(id, this.category);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        if (response.category) {
            this.categoryOriginalData = response.category;
            this.showCategory(response.category);
        }
    }

    private showCategory(category: CategoryResponseType): void {
        if (!this.categoryTitleInputElement) return;
        this.categoryTitleInputElement.value = category.title;
    }

    private async updateCategory(): Promise<void | null> {
        if (!this.categoryTitleInputElement || !this.categoryOriginalData) return;

        const changedData: { title: string } = { title: '' };

        if (this.categoryTitleInputElement.value !== this.categoryOriginalData.title) {
            changedData.title = this.categoryTitleInputElement.value;
        }

        console.log(changedData);

        if (Object.keys(changedData).length > 0) {
            const response: CategoryType = await CategoriesService.updateCategory(this.categoryOriginalData.id, changedData, this.category);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/' + this.category);
        }
    }
}
