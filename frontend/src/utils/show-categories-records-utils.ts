import {CategoryResponseType} from "../types/categories.type";

export class ShowCategoriesRecordsUtils {
    public static showRecords(categories: CategoryResponseType[], category: string): void {
        const recordsElement: HTMLElement | null = document.getElementById('records');
        if (!recordsElement) return;

        if (categories.length > 0) {
            for (let i = 0; i < categories.length; i++) {
                const itemElement: HTMLElement = document.createElement('div');
                const itemContentElement: HTMLElement = document.createElement('div');
                const titleElement: HTMLElement = document.createElement('h2');
                const toolbarElement: HTMLElement = document.createElement('div');
                const buttonGroupFirstElement: HTMLElement = document.createElement('div');
                const buttonFirstElement: HTMLElement = document.createElement('a');
                const buttonGroupSecondElement: HTMLElement = document.createElement('div');
                const buttonSecondElement: HTMLElement = document.createElement('button');

                titleElement.innerText = categories[i].title;
                buttonFirstElement.innerText = 'Редактировать';
                buttonSecondElement.innerText = 'Удалить';

                itemElement.classList.add('col-xl-4');
                itemElement.classList.add('col-lg-6');
                itemElement.classList.add('col-md-9');
                itemElement.classList.add('col-sm-12');
                itemElement.classList.add('p-2');

                itemContentElement.classList.add('p-3');
                itemContentElement.classList.add('border');
                itemContentElement.classList.add('rounded-4');

                titleElement.classList.add('fs-3');

                toolbarElement.classList.add('btn-toolbar');
                toolbarElement.setAttribute('role', 'toolbar');
                toolbarElement.setAttribute('aria-label', 'Toolbar with button groups');

                buttonGroupFirstElement.classList.add('btn-group');
                buttonGroupFirstElement.classList.add('me-2');
                buttonGroupFirstElement.setAttribute('role', 'group');
                buttonGroupFirstElement.setAttribute('aria-label', 'First group');

                buttonFirstElement.classList.add('btn');
                buttonFirstElement.classList.add('btn-primary');
                buttonFirstElement.classList.add(category + '-btn');
                buttonFirstElement.setAttribute('href', '/' + category + '/edit?id=' + categories[i].id);

                buttonGroupSecondElement.classList.add('btn-group');
                buttonGroupSecondElement.classList.add('me-2');
                buttonGroupSecondElement.setAttribute('role', 'group');
                buttonGroupSecondElement.setAttribute('aria-label', 'Second group');

                buttonSecondElement.classList.add('btn');
                buttonSecondElement.classList.add('btn-danger');
                buttonSecondElement.classList.add(category + '-btn');
                buttonSecondElement.setAttribute('type', 'button');
                buttonSecondElement.setAttribute('data-bs-toggle', 'modal');
                buttonSecondElement.setAttribute('data-bs-target', '#modal');
                buttonSecondElement.addEventListener('click', () => {
                    const deleteLinkElement: HTMLElement | null = document.getElementById('delete-link');
                    deleteLinkElement?.setAttribute('href', '/' + category + '/delete?id=' + categories[i].id);
                });

                buttonGroupFirstElement.appendChild(buttonFirstElement);
                buttonGroupSecondElement.appendChild(buttonSecondElement);

                toolbarElement.appendChild(buttonGroupFirstElement);
                toolbarElement.appendChild(buttonGroupSecondElement);

                itemContentElement.appendChild(titleElement);
                itemContentElement.appendChild(toolbarElement);

                itemElement.appendChild(itemContentElement);

                recordsElement.appendChild(itemElement);
            }
        }

        const itemElement: HTMLElement = document.createElement('div');
        const itemContentElement: HTMLElement = document.createElement('a');
        const addItemElement: HTMLElement = document.createElement('span');

        addItemElement.innerText = '+';

        itemElement.classList.add('col-xl-4');
        itemElement.classList.add('col-lg-6');
        itemElement.classList.add('col-md-9');
        itemElement.classList.add('col-sm-12');
        itemElement.classList.add('p-2');
        itemElement.classList.add('category-item');

        itemContentElement.classList.add('btn');
        itemContentElement.classList.add('p-3');
        itemContentElement.classList.add('border');
        itemContentElement.classList.add('rounded-4');
        itemContentElement.classList.add('h-100');
        itemContentElement.classList.add('d-flex');
        itemContentElement.classList.add('justify-content-center');
        itemContentElement.setAttribute('href', '/' + category + '/create');
        itemContentElement.setAttribute('id', 'add-' + category + '-button');

        addItemElement.classList.add('btn');
        addItemElement.classList.add('fs-4');
        addItemElement.classList.add('text-body-tertiary');
        addItemElement.classList.add('d-flex');
        addItemElement.classList.add('align-items-center');

        itemContentElement.appendChild(addItemElement);
        itemElement.appendChild(itemContentElement);

        recordsElement.appendChild(itemElement);
    }
}
