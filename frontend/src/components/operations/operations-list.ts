import {OperationsService} from "../../services/operations-service";
import {DatepickerInputUtils} from "../../utils/datepicker-input-utils";
import {DateFilterUtils} from "../../utils/date-filter-utils";
import {ShowOperationsRecordsUtils} from "../../utils/show-operations-records-utils";
import {DateResponseType} from "../../types/date-response.type";
import {OperationsType} from "../../types/operations.type";

export class OperationsList {
    readonly openNewRoute: (url: string) => Promise<void>;
    private filterButtons: NodeListOf<HTMLElement> | null = null;
    private startDateInputElement: HTMLInputElement | null = null;
    private endDateInputElement: HTMLInputElement | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        DatepickerInputUtils.changeInputType();

        this.findElements();
        this.init();

        this.getOperations({period: ''}).then();
    }

    private findElements(): void {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.startDateInputElement = document.getElementById('start-date-input') as HTMLInputElement | null;
        this.endDateInputElement = document.getElementById('end-date-input') as HTMLInputElement | null;
    }

    private init(): void {
        if (!this.filterButtons || !this.startDateInputElement || !this.endDateInputElement) return;

        const inputs: HTMLInputElement[] = [this.startDateInputElement as HTMLInputElement, this.endDateInputElement as HTMLInputElement];

        this.filterButtons.forEach((button: HTMLElement) => {
            button.addEventListener('click', (e: MouseEvent) => {
                this.getOperations(DateFilterUtils.toggleFilterButtonsHandler(e, this.filterButtons as NodeListOf<HTMLElement>, inputs)).then();
            });
        });

        inputs.forEach((input: HTMLInputElement) => {
            input.addEventListener('change', (e: Event) => {
                if ((this.startDateInputElement as HTMLInputElement).value && (this.endDateInputElement as HTMLInputElement).value
                    && parseInt((this.startDateInputElement as HTMLInputElement).value[0]) !== 0
                    && parseInt((this.endDateInputElement as HTMLInputElement).value[0]) !== 0) {
                    this.filterButtons?.forEach((button: HTMLElement) => {
                        button.classList.remove('active');
                    });
                    this.getOperations({
                        interval: {
                            from: (this.startDateInputElement as HTMLInputElement).value,
                            to: (this.endDateInputElement as HTMLInputElement).value
                        }
                    }).then();
                }
            });
        });
    }

    public async getOperations(date: DateResponseType): Promise<void | null> {
        const response: OperationsType = await OperationsService.getOperations(date);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        await ShowOperationsRecordsUtils.showRecords(response.operations);
    }
}
