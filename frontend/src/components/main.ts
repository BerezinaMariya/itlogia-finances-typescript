import {DatepickerInputUtils} from "../utils/datepicker-input-utils";
import {Chart, ChartConfiguration} from "chart.js/auto";
import {DateFilterUtils} from "../utils/date-filter-utils";
import {OperationsService} from "../services/operations-service";
import {OperationResponseType, OperationsType} from "../types/operations.type";
import {DateResponseType} from "../types/date-response.type";

export class Main {
    readonly openNewRoute: (url: string) => Promise<void>;
    private filterButtons: NodeListOf<HTMLElement> | null = null;
    private startDateInputElement: HTMLInputElement | null = null;
    private endDateInputElement: HTMLInputElement | null = null;
    private incomeChart: Chart | undefined;
    private expenseChart: Chart | undefined;
    private incomeSectorValues: number[] = [];
    private expenseSectorValues: number[] = [];
    private incomeLabelValues: string[] = [];
    private expenseLabelValues: string[] = [];

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        DatepickerInputUtils.changeInputType();

        this.findElements();
        this.init();
        this.getOperations({period: ''}).then();
        this.initCanvases();
    }

    private findElements(): void {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.startDateInputElement = document.getElementById('start-date-input') as HTMLInputElement | null;
        this.endDateInputElement = document.getElementById('end-date-input') as HTMLInputElement | null;
    }

    private init(): void {
        if (!this.filterButtons || !this.startDateInputElement || !this.endDateInputElement) return;

        if (this.startDateInputElement as HTMLInputElement && this.endDateInputElement as HTMLInputElement) {
            const inputs: HTMLInputElement[] = [this.startDateInputElement, this.endDateInputElement];

            this.filterButtons.forEach((button: HTMLElement) => {
                button.addEventListener('click', (e: MouseEvent) => {
                    this.getOperations(DateFilterUtils.toggleFilterButtonsHandler(e, this.filterButtons!, inputs)).then();
                });
            });

            inputs.forEach((input: HTMLInputElement) => {
                input.addEventListener('change', (e: Event) => {
                    if (this.startDateInputElement!.value && this.endDateInputElement!.value
                        && parseInt(this.startDateInputElement!.value[0]) !== 0
                        && parseInt(this.endDateInputElement!.value[0]) !== 0) {
                        this.filterButtons?.forEach((button: HTMLElement) => {
                            button.classList.remove('active');
                        });
                        this.getOperations({
                            interval: {
                                from: this.startDateInputElement!.value,
                                to: this.endDateInputElement!.value
                            }
                        }).then();
                    }
                });
            });
        }
    }

    private initCanvases(): void {
        this.incomeChart = this.addCanvas('income-chart');
        this.expenseChart = this.addCanvas('expense-chart');
    }

    private async getOperations(date: DateResponseType): Promise<void | null> {
        const loader: HTMLElement | null = document.getElementById('loader');
        const line: HTMLElement | null = document.getElementById('line');

        if (loader && line) {
            loader.classList.remove('d-none');
            loader.classList.add('d-flex');
            line.classList.remove('d-xl-block');
            line.classList.add('d-xl-none');

            const response: OperationsType = await OperationsService.getOperations(date);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            if (response.operations.length > 0) {
                loader.classList.add('d-none');
                loader.classList.remove('d-flex');
                line.classList.add('d-xl-block');
                line.classList.remove('d-xl-none');
            }

            this.setChartData(response.operations);
        }
    }

    private setChartData(operations: OperationResponseType[]): void {
        const barColors: string[] = ["#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD", "#dc35a7", "#fda014", "#deff07", "#4ac920", "#0db5fd"];

        operations.forEach((operation: OperationResponseType) => {
            if (operation.type === 'income') {
                this.incomeSectorValues.push(operation.amount);
                this.incomeLabelValues.push(operation.category);
            } else {
                this.expenseSectorValues.push(operation.amount);
                this.expenseLabelValues.push(operation.category);
            }
        });

        const chartData = (chartId: string) => {
            return {
                labels: chartId === 'income-chart' ? this.incomeLabelValues : this.expenseLabelValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: chartId === 'income-chart' ? this.incomeSectorValues : this.expenseSectorValues,
                }]
            };
        }

        const updateChartConfig = (chart: Chart) => {
            chart.data = chartData(chart.canvas.id);
            chart.update();
        }

        if (this.incomeChart) {
            updateChartConfig(this.incomeChart);
        }
        if (this.expenseChart) {
            updateChartConfig(this.expenseChart);
        }
    }

    private addCanvas(canvasId: string): Chart {
        //pie
        const paddingBelowLegends: {id: string, beforeInit(chart: any): void} = {
            id: 'paddingBelowLegends',
            beforeInit(chart) {
                // Get a reference to the original fit function
                const originalFit = chart.legend.fit;

                // Override the fit function
                chart.legend.fit = function fit() {
                    // Call the original function and bind scope in order to use `this` correctly inside it
                    originalFit.bind(chart.legend)();
                    // Change the height as suggested in other answers
                    this.height += 40;
                }
            }
        }

        const chartConfig: ChartConfiguration = {
            type: "pie",
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            boxWidth: 35,
                            font: {
                                size: 14,
                                family: 'Roboto, sans-serif',
                                weight: 500,
                            },
                            color: '#000000',
                            padding: 12,
                            textAlign: 'left'
                        },
                    },
                    title: {
                        display: true,
                        font: {
                            size: 28,
                            family: 'Roboto, sans-serif',
                            weight: 500,
                        },
                        color: '#052C65',
                        text: canvasId === 'income-chart' ? 'Доходы' : 'Расходы'
                    },
                }
            },
            plugins: [paddingBelowLegends]
        };

        return new Chart(canvasId, chartConfig);
    }
}
