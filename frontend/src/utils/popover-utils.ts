import { Popover } from "bootstrap";

export class PopoverUtils {
    public static initPopover(): void {
        const popoverBodyElement: HTMLElement | null = document.getElementById('popover-body');

        if (popoverBodyElement) {
            document.querySelectorAll('[data-bs-toggle="popover"]')
                .forEach(popover => {
                    new Popover(popover, {
                        html: true,
                        content: function () {
                            return popoverBodyElement.innerHTML;
                        }
                    });
                });
        }
    }
}
