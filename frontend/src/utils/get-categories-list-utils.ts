import {CategoriesType, CategoryResponseType} from "../types/categories.type";

export class GetCategoriesListUtils {
    public static async getCategoriesList(response: CategoriesType): Promise<void> {
        const categoriesList: CategoryResponseType[] = response.categories;

        const categorySelectElement: HTMLElement | null = document.getElementById('category-select');

        if (categorySelectElement) {
            categorySelectElement.querySelectorAll('.choice-option').forEach(option => option.remove());

            if (categoriesList.length > 0) {
                for (let i = 0; i < categoriesList.length; i++) {
                    const optionElement: HTMLOptionElement = document.createElement('option');

                    optionElement.classList.add('choice-option');
                    optionElement.setAttribute('value', categoriesList[i].id.toString());
                    optionElement.innerText = categoriesList[i].title;

                    categorySelectElement.appendChild(optionElement);
                }
            }
        }
    }
}
