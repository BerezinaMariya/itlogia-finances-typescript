import {Main} from "../components/main";
import {Login} from "../components/auth/login";
import {Signup} from "../components/auth/signup";
import {Logout} from "../components/auth/logout"
import {CategoriesList} from "../components/categories/categories-list";
import {CategoriesCreate} from "../components/categories/categories-create";
import {CategoriesEdit} from "../components/categories/categories-edit";
import {CategoriesDelete} from "../components/categories/categories-delete";
import {OperationsList} from "../components/operations/operations-list";
import {OperationsCreate} from "../components/operations/operations-create";
import {OperationsEdit} from "../components/operations/operations-edit";
import {OperationsDelete} from "../components/operations/operations-delete";
import {RouteType} from "../types/route.type";
import {CategoryNamesType} from "../types/category-names.type";

export class RoutesUtils {
    public static getRoutes(openNewRoute: (url: string) => Promise<void>): RouteType[] {
        return [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new Main(openNewRoute);
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: null,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: null,
                load: (): void => {
                    document.body.classList.add('vh-100');
                    new Login(openNewRoute);
                },
                unload: (): void => {
                    document.body.classList.remove('vh-100');
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/signup.html',
                useLayout: null,
                load: (): void => {
                    document.body.classList.add('vh-100');
                    new Signup(openNewRoute);
                },
                unload: (): void => {
                    document.body.classList.remove('vh-100');
                },
            },
            {
                route: '/logout',
                load: (): void => {
                    new Logout(openNewRoute);
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/list.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CategoriesList(openNewRoute, CategoryNamesType.income);
                },
            },
            {
                route: '/income/create',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/income/create.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CategoriesCreate(openNewRoute, CategoryNamesType.income);
                },
            },
            {
                route: '/income/edit',
                title: 'Редактирование дохода',
                filePathTemplate: '/templates/pages/income/edit.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CategoriesEdit(openNewRoute, CategoryNamesType.income);
                },
            },
            {
                route: '/income/delete',
                load: (): void => {
                    new CategoriesDelete(openNewRoute, CategoryNamesType.income);
                },
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expense/list.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CategoriesList(openNewRoute, CategoryNamesType.expense);
                },
            },
            {
                route: '/expense/create',
                title: 'Создание расхода',
                filePathTemplate: '/templates/pages/expense/create.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CategoriesCreate(openNewRoute, CategoryNamesType.expense);
                },
            },
            {
                route: '/expense/edit',
                title: 'Редактирование расхода',
                filePathTemplate: '/templates/pages/expense/edit.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new CategoriesEdit(openNewRoute, CategoryNamesType.expense);
                },
            },
            {
                route: '/expense/delete',
                load: (): void => {
                    new CategoriesDelete(openNewRoute, CategoryNamesType.expense);
                },
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operations/list.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new OperationsList(openNewRoute);
                },
            },
            {
                route: '/operations/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/operations/create.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new OperationsCreate(openNewRoute);
                },
            },
            {
                route: '/operations/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/operations/edit.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new OperationsEdit(openNewRoute);
                },
            },
            {
                route: '/operations/delete',
                load: (): void => {
                    new OperationsDelete(openNewRoute);
                },
            },
        ]
    }
}
