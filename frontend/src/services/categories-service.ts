import {HttpUtils} from "../utils/http-utils";
import {
    CategoriesType, CategoryCreateType, CategoryGetType, CategoryType
} from "../types/categories.type";
import {HttpRequestType} from "../types/http-request.type";

export class CategoriesService {
    public static async getCategories(category: string): Promise<CategoriesType> {
        const returnObject: CategoriesType = {
            error: null,
            redirect: null,
            categories: []
        };

        const result: HttpRequestType = await HttpUtils.request('/categories/' + category);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе категорий. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.categories = result.response;
        return returnObject;
    }

    public static async getCategory(id: number, category: string): Promise<CategoryGetType> {
        const returnObject: CategoryGetType = {
            error: null,
            redirect: null,
            category: null
        };

        const result: HttpRequestType = await HttpUtils.request('/categories/' + category + '/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.category = result.response;
        return returnObject;
    }

    public static async createCategory(data: { title: string }, category: string): Promise<CategoryCreateType> {
        const returnObject: CategoryCreateType = {
            error: null,
            redirect: null,
            id: null
        };

        const result: HttpRequestType = await HttpUtils.request('/categories/' + category, 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при добавлении категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }

    public static async updateCategory(id: number, data: { title: string }, category: string): Promise<CategoryType> {
        const returnObject: CategoryType = {
            error: null,
            redirect: null
        };

        const result: HttpRequestType = await HttpUtils.request('/categories/' + category + '/' + id, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    public static async deleteCategory(id: number, category: string): Promise<CategoryType> {
        const returnObject: CategoryType = {
            error: null,
            redirect: null
        };

        const result: HttpRequestType = await HttpUtils.request('/categories/' + category + '/' + id, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}
