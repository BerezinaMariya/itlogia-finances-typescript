import {CategoriesButtonUtils} from "./utils/categories-button-utils";
import {SidebarUtils} from "./utils/sidebar-utils";
import {PopoverUtils} from "./utils/popover-utils";
import {AuthUtils} from "./utils/auth-utils";
import {GetBalanceUtils} from "./utils/get-balance-utils";
import {RoutesUtils} from "./utils/routes-utils";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/user-info.type";

export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private userName: string | null = null;
    readonly routes: RouteType[];

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.routes = RoutesUtils.getRoutes(this.openNewRoute.bind(this));
        console.log(this.routes);

        this.initEvents();
    }

    private initEvents(): void {
        document.addEventListener('click', this.clickHandler.bind(this));
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));  // при первом открытии страницы
        window.addEventListener('popstate', this.activateRoute.bind(this));  // при переходе со страницы на страницу
    }

    public async openNewRoute(url: string, e?: Event): Promise<void> {
        const currentRoute: string = window.location.pathname;
        console.log(currentRoute);
        history.pushState({}, '', url);

        this.activateRoute(e as Event, currentRoute).then();
    }

    private async clickHandler(e: Event): Promise<void> {
        let element: HTMLLinkElement | null = null;

        const target: HTMLLinkElement = e.target as HTMLLinkElement;
        if (target) {
            if (target.nodeName === 'a') {
                element = target;
            } else if (target.parentNode && target.parentNode.nodeName === 'a') {
                element = target.parentNode as HTMLLinkElement;
            }
        }

        if (element) {
            e.preventDefault();

            console.log(element);
            const currentRoute: string = window.location.pathname;

            const url: string = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    public async activateRoute(e: Event, oldRoute: string | null = null): Promise<void> {
        console.log(oldRoute);
        if (oldRoute) {
            const currentRoute: RouteType | undefined = this.routes.find((item: RouteType) => item.route === oldRoute);

            if (currentRoute) {
                if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                    currentRoute.unload();
                }
            }
        }

        const urlRoute: string = window.location.pathname;
        const newRoute: RouteType | undefined = this.routes.find((item: RouteType) => item.route === urlRoute);


        if (newRoute) {
            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentPageElement;

                if (newRoute.useLayout) {
                    if (this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then((response: Response) => response.text());
                    }

                    contentBlock = document.getElementById('content-layout');
                    const profileNameElement: HTMLElement | null = document.getElementById('profile-name');

                    if (!this.userName) {
                        let userInfoItem: string | null = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);

                        if (userInfoItem) {
                            const userInfo: UserInfoType = JSON.parse(userInfoItem);
                            if (userInfo.name || userInfo.lastName) {
                                this.userName = userInfo.name + " " + userInfo.lastName;
                            }
                        }
                    }

                    if (profileNameElement && this.userName) {
                        profileNameElement.innerText = this.userName;
                    }

                    this.activateMenuItem(newRoute);

                    await GetBalanceUtils.getBalance(this.openNewRoute);
                    PopoverUtils.initPopover();

                    SidebarUtils.openMenuHandler();
                    SidebarUtils.closeMenuHandler();
                }

                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then((response: Response) => response.text());
                }
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            history.pushState({}, '', '/404');
            await this.activateRoute(e);
        }
    }

    private activateMenuItem(route: RouteType): void {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href: string | null = item.getAttribute('href');

            if (href) {
                if ((route.route.includes(href) && href !== '/' || (route.route === '/' && href === '/'))) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }

            CategoriesButtonUtils.toggleCategoriesButton(route);
        });
    }
}
