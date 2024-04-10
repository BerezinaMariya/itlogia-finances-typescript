export class SelectOptionsUtils {
    public static changeOptionTextColor(): void {
        const formSelectElements: NodeListOf<HTMLInputElement> = document.querySelectorAll('.form-select');

        formSelectElements.forEach((select: HTMLInputElement) => {
            if (select.value === "") {
                select.style.color = '#6C757D';
            } else {
                select.style.color = '#212529';
            }
        });
    }
}
