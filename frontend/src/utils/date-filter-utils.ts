export class DateFilterUtils {
    public static toggleFilterButtonsHandler(e: Event, filterButtons: NodeListOf<HTMLElement>, inputs: HTMLInputElement[]): { period: string } {
        inputs.forEach((input: HTMLInputElement) => {
            input.value = '';
            input.type = 'text';
            input.style.width = '63px';
        });

        let period: string = '';
        filterButtons.forEach((button: HTMLElement) => {
            button.classList.remove('active');
            (e.currentTarget as HTMLButtonElement).classList.add('active');

            if (button.id === "today-operations" && button.classList.contains('active')) {
                period = '';
            } else if (button.id === "week-operations" && button.classList.contains('active')) {
                period = 'week';
            } else if (button.id === "month-operations" && button.classList.contains('active')) {
                period = 'month';
            } else if (button.id === "year-operations" && button.classList.contains('active')) {
                period = 'year';
            } else if (button.id === "all-operations" && button.classList.contains('active')) {
                period = 'all';
            }
        });

        return {period: period};
    }
}
