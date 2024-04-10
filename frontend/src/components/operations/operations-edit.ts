import {GetCategoriesListUtils} from "../../utils/get-categories-list-utils";
import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {CategoriesService} from "../../services/categories-service";
import {DatepickerInputUtils} from "../../utils/datepicker-input-utils";
import {SelectOptionsUtils} from "../../utils/select-options-utils";
import {ValidationItemType} from "../../types/validation-item.type";
import {CategoriesType} from "../../types/categories.type";
import {
    OperationGetType,
    OperationRequestDataType,
    OperationResponseType,
    OperationType
} from "../../types/operations.type";

export class OperationsEdit {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly validations: ValidationItemType[] = [];
    private categoryTypeSelect: HTMLSelectElement | null = null;
    private categorySelect: HTMLSelectElement | null = null;
    private amountInputElement: HTMLInputElement | null = null;
    private dateInputElement: HTMLInputElement | null = null;
    private commentInputElement: HTMLInputElement | null = null;
    private operationOriginalData: OperationResponseType | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        DatepickerInputUtils.changeInputType();

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/').then();
            return;
        }

        this.getOperation(parseInt(id)).then();

        this.findElements();

        if (this.categoryTypeSelect && this.categorySelect && this.amountInputElement && this.dateInputElement) {
            this.validations = [
                {element: this.categoryTypeSelect},
                {element: this.categorySelect},
                {element: this.amountInputElement},
                {element: this.dateInputElement}
            ];
        }

        this.init();
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
            this.categoryTypeSelect.addEventListener('change', (e) => {
                this.getCategoriesList(e).then();
                SelectOptionsUtils.changeOptionTextColor();
            });
            this.categorySelect.addEventListener('change', SelectOptionsUtils.changeOptionTextColor);
        }

        const saveButton: HTMLElement | null = document.getElementById('save-button');
        if (saveButton) {
            saveButton.addEventListener('click', this.updateOperation.bind(this));
        }
    }

    private async getCategoriesList(e: Event): Promise<void> {
        const response: CategoriesType = await CategoriesService.getCategories((e.target as HTMLSelectElement).value);
        await GetCategoriesListUtils.getCategoriesList(response);
    }

    private async getOperation(id: number): Promise<void | null> {
        const response: OperationGetType = await OperationsService.getOperation(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        if (response.operation) {
            this.operationOriginalData = response.operation;
            const getCategoriesResponse: CategoriesType = await CategoriesService.getCategories(response.operation.type);
            await GetCategoriesListUtils.getCategoriesList(getCategoriesResponse);

            this.showOperation(response.operation);
            SelectOptionsUtils.changeOptionTextColor();
        }
    }

    private showOperation(operation: OperationResponseType): void {
        if (!this.categoryTypeSelect || !this.categorySelect || !this.amountInputElement || !this.dateInputElement || !this.commentInputElement) return;
        this.categoryTypeSelect.value = operation.type;
        this.categorySelect.value = operation.category;
        this.amountInputElement.value = operation.amount.toString();
        this.dateInputElement.value = operation.date;
        this.commentInputElement.value = operation.comment;


        for (let i = 0; i < this.categoryTypeSelect.options.length; i++) {
            if (this.categoryTypeSelect.options[i].value === operation.type) {
                this.categoryTypeSelect.selectedIndex = i;
            }
        }

        for (let i = 0; i < this.categorySelect.options.length; i++) {
            if (this.categorySelect.options[i].innerText === operation.category) {
                this.categorySelect.selectedIndex = i;
            }
        }
    }

    private async updateOperation(e: Event): Promise<void | null> {
        e.preventDefault();

        if (!this.categoryTypeSelect || !this.categorySelect || !this.amountInputElement || !this.dateInputElement || !this.commentInputElement) return;

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData: OperationRequestDataType = {
                type: this.categoryTypeSelect.value,
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value.split('.').reverse().join('-'),
                comment: this.commentInputElement.value,
                category_id: parseInt(this.categorySelect.value)
            };

            if (this.operationOriginalData) {
                const response: OperationType = await OperationsService.updateOperation(this.operationOriginalData.id, changedData);

                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/operations');
            }
        }
    }
}
