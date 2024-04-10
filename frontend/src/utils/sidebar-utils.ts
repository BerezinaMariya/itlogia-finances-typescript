export class SidebarUtils {
    public static openMenuHandler(): void {
        const menuOpenButtonElement: HTMLElement | null = document.getElementById('menu-icon');
        const menuElement: HTMLElement | null = document.getElementById('menu');

        if (menuOpenButtonElement && menuElement) {
            menuOpenButtonElement.addEventListener('click', function () {
                menuElement.classList.remove('d-none');
                menuElement.classList.add('d-flex');
            });
        }
    }

    public static closeMenuHandler(): void {
        const menuCloseButtonElement: HTMLElement | null = document.getElementById('menu-close');
        const menuElement: HTMLElement | null = document.getElementById('menu');
        const overlayElement: HTMLElement | null = document.getElementById('content-layout');

        if (menuCloseButtonElement && menuElement && overlayElement) {
            menuCloseButtonElement.addEventListener('click', function (e) {
                menuElement.classList.remove('d-flex');
                menuElement.classList.add('d-none');
            });

            overlayElement.addEventListener('click', function (e) {
                if (menuElement.classList.contains('d-flex')) {
                    menuElement.classList.remove('d-flex');
                    menuElement.classList.add('d-none');
                }
            });
        }
    }
}
