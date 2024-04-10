import {CategoriesService} from "../services/categories-service";
import {OperationResponseType} from "../types/operations.type";

export class ShowOperationsRecordsUtils {
    static async showRecords(operations: OperationResponseType[]): Promise<void> {
        const recordsElement: HTMLElement | null = document.getElementById('records');
        if (!recordsElement) return;

        while (recordsElement.firstChild) {
            recordsElement.removeChild(recordsElement.firstChild);
        }

        if (operations.length > 0) {
            for (let i = 0; i < operations.length; i++) {
                const trElement: HTMLTableRowElement = document.createElement('tr');
                const tdNumberElement: HTMLTableCellElement = document.createElement('td');
                const tdTypeElement: HTMLTableCellElement  = document.createElement('td');
                const tdCategoryElement: HTMLTableCellElement  = document.createElement('td');
                const tdAmountElement: HTMLTableCellElement  = document.createElement('td');
                const tdDateElement: HTMLTableCellElement  = document.createElement('td');
                const tdCommentElement: HTMLTableCellElement  = document.createElement('td');
                const tdEmptyElement: HTMLTableCellElement  = document.createElement('td');
                const divElement: HTMLElement = document.createElement('div');
                const trashLinkElement: HTMLElement = document.createElement('a');
                const trashIconElement: HTMLElement = document.createElement('img');
                const editLinkElement: HTMLElement = document.createElement('a');
                const editIconElement: HTMLElement = document.createElement('img');

                trElement.classList.add('text-center');

                tdNumberElement.classList.add('text-reset');
                tdNumberElement.setAttribute('data-label', '№ операции');
                tdNumberElement.innerText = operations[i].id.toString();

                tdTypeElement.classList.add(operations[i].type === 'income' ? 'text-success' : 'text-danger');
                tdTypeElement.setAttribute('data-label', 'Тип');
                tdTypeElement.innerText = operations[i].type === 'income' ? 'доход' : 'расход';

                tdCategoryElement.classList.add('text-reset');
                tdCategoryElement.setAttribute('data-label', 'Категория');
                tdCategoryElement.innerText = operations[i].category;

                tdAmountElement.classList.add('text-reset');
                tdAmountElement.setAttribute('data-label', 'Сумма');
                tdAmountElement.innerText = operations[i].amount.toString();

                tdDateElement.classList.add('text-reset');
                tdDateElement.setAttribute('data-label', 'Дата');
                tdDateElement.innerText = operations[i].date.split('-').reverse().join('.');

                tdCommentElement.classList.add('text-reset');
                tdCommentElement.setAttribute('data-label', 'Комментарий');
                tdCommentElement.innerText = operations[i].comment;

                tdEmptyElement.setAttribute('data-label', '');

                divElement.classList.add('income-tools');

                trashLinkElement.classList.add('me-2');
                trashLinkElement.setAttribute('data-bs-toggle', 'modal');
                trashLinkElement.setAttribute('data-bs-target', '#modal');
                trashLinkElement.addEventListener('click', () => {
                    const deleteLinkElement = document.getElementById('delete-link');
                    deleteLinkElement?.setAttribute('href', '/operations/delete?id=' + operations[i].id);
                });

                trashIconElement.setAttribute('src', '/images/icon-trash.png');
                trashIconElement.setAttribute('alt', 'Иконка мусорного ведра');

                editLinkElement.setAttribute('href', '/operations/edit?id=' + operations[i].id);

                editIconElement.setAttribute('src', '/images/icon-edit.png');
                editIconElement.setAttribute('alt', 'Иконка карандаша');

                trashLinkElement.appendChild(trashIconElement);
                editLinkElement.appendChild(editIconElement);

                divElement.appendChild(trashLinkElement);
                divElement.appendChild(editLinkElement);

                tdEmptyElement.appendChild(divElement);

                trElement.appendChild(tdNumberElement);
                trElement.appendChild(tdTypeElement);
                trElement.appendChild(tdCategoryElement);
                trElement.appendChild(tdAmountElement);
                trElement.appendChild(tdDateElement);
                trElement.appendChild(tdCommentElement);
                trElement.appendChild(tdEmptyElement);

                recordsElement.appendChild(trElement);
            }
        }
    }
}
