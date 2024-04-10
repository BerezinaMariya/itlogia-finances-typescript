import {CategoriesService} from "../../services/categories-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {OperationsService} from "../../services/operations-service";
import {GetCategoriesListUtils} from "../../utils/get-categories-list-utils";
import {DatepickerInputUtils} from "../../utils/datepicker-input-utils";
import {SelectOptionsUtils} from "../../utils/select-options-utils";
import {ValidationItemType} from "../../types/validation-item.type";
import {CategoriesType} from "../../types/categories.type";
import {OperationCreateType, OperationRequestDataType} from "../../types/operations.type";

export class OperationsCreate {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly validations: ValidationItemType[] = [];
    private categoryTypeSelect: HTMLSelectElement | null = null;
    private categorySelect: HTMLSelectElement | null = null;
    private amountInputElement: HTMLInputElement | null = null;
    private dateInputElement: HTMLInputElement | null = null;
    private commentInputElement: HTMLInputElement | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        DatepickerInputUtils.changeInputType();
        SelectOptionsUtils.changeOptionTextColor();

        this.findElements();
        this.init();

        if (this.categoryTypeSelect && this.categorySelect && this.amountInputElement && this.dateInputElement) {
            this.validations = [
                {element: this.categoryTypeSelect},
                {element: this.categorySelect},
                {element: this.amountInputElement},
                {element: this.dateInputElement}
            ];
        }
    }

    private findElements(): void {
        this.categoryTypeSelect = document.getElementById('category-type-select') as HTMLSelectElement | null;
        this.categorySelect = document.getElementById('category-select') as HTMLSelectElement | null;
        this.amountInputElement = document.getElementById('amount-input') as HTMLInputElement | null;
        this.dateInputElement = document.getElementById('date-input') as HTMLInputElement | null;
        this.commentInputElement = document.getElementById('comment-input') as HTMLInputElement | null;
    }

    private init(): void {
        if (this.categoryTypeSelect && this.categorySelect) {
            this.categoryTypeSelect.addEventListener('change', (e: Event) => {
                this.getCategoriesList(e).then();
                SelectOptionsUtils.changeOptionTextColor();
            });
            this.categorySelect.addEventListener('change', SelectOptionsUtils.changeOptionTextColor);
        }

        const saveButton: HTMLElement | null = document.getElementById('save-button');
        if (saveButton) {
            saveButton.addEventListener('click', this.saveOperation.bind(this));
        }
    }

    private async getCategoriesList(e: Event): Promise<void> {
        const response: CategoriesType = await CategoriesService.getCategories((e.target as HTMLSelectElement).value);
        await GetCategoriesListUtils.getCategoriesList(response);
    }

    private async saveOperation(e: Event): Promise<void | null> {
        e.preventDefault();

        if (!this.categoryTypeSelect || !this.amountInputElement || !this.dateInputElement || !this.commentInputElement || !this.categorySelect) return;

        if (ValidationUtils.validateForm(this.validations)) {
            const createData: OperationRequestDataType = {
                type: this.categoryTypeSelect.value,
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value.split('.').reverse().join('-'),
                comment: this.commentInputElement.value,
                category_id: parseInt(this.categorySelect.value)
            }

            const response: OperationCreateType = await OperationsService.createOperation(createData);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/operations');
        }
    }

}
