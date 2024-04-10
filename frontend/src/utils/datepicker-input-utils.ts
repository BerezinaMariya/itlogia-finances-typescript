export class DatepickerInputUtils {
    public static changeInputType(): void {
        const datepickerInputElements: NodeListOf<HTMLInputElement> = document.querySelectorAll('.datepicker-input');
        datepickerInputElements.forEach((input: HTMLInputElement) => {
            input.onblur = function() {
                input.value === '' ? input.type = 'text' : input.type = 'date';

                if (input.classList.contains('tab-input')) {
                    input.value === '' ? input.style.width = '63px' : input.style.width = 'max-content';
                }
            };

            input.onfocus = function() {
                input.type = 'date';
                if (input.classList.contains('tab-input')) {
                    input.style.width = 'max-content';
                }
            }
        });
    }
}
