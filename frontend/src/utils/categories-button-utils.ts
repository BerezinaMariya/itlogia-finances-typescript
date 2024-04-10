import {RouteType} from "../types/route.type";

export class CategoriesButtonUtils {
    public static toggleCategoriesButton(route: RouteType): void {
        const operationsLinkElement: HTMLElement | null = document.getElementById('operations-link');
        const incomeLinkElement: HTMLElement | null = document.getElementById('operations-link');
        const categoriesToggleButtonElement: HTMLElement | null = document.getElementById('categories-toggle-button');
        const collapseOneElement: HTMLElement | null = document.getElementById('collapseOne');
        const accordionItemElement: HTMLElement | null = document.getElementById('accordion-item');

        if (operationsLinkElement && incomeLinkElement) {
            if (route.route === '/operations/create' || route.route === '/operations/edit') {
                operationsLinkElement.classList.remove('active');
                incomeLinkElement.classList.add('active');
            }
        }

        if (categoriesToggleButtonElement && collapseOneElement && accordionItemElement) {
            if (route.title === 'Главная' || route.title === 'Доходы и расходы') {
                categoriesToggleButtonElement.classList.add('collapsed');
                categoriesToggleButtonElement.removeAttribute('aria-expanded');
                collapseOneElement.classList.remove('show');
                accordionItemElement.classList.remove('accordion-active');
            } else {
                categoriesToggleButtonElement.classList.remove('collapsed');
                categoriesToggleButtonElement.setAttribute('aria-expanded', 'true');
                collapseOneElement.classList.add('show');
                accordionItemElement.classList.add('accordion-active');
            }
        }
    }
}
