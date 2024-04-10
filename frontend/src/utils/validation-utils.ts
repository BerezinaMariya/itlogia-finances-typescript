import {ValidationItemType} from "../types/validation-item.type";

export class ValidationUtils {
    static validateForm(validations: ValidationItemType[]): boolean {
        let isValid: boolean = true;

        for (let i = 0; i < validations.length; i++) {
            if (!ValidationUtils.validateField( {element: validations[i].element, options: validations[i].options})) {
                isValid = false;
            }
        }

        return isValid;
    }

    static validateField({element, options}: ValidationItemType): boolean {
        let condition: string | RegExpMatchArray | null | boolean = element.value;

        if (options) {
            if (options.hasOwnProperty('pattern') && options.pattern) {
                condition = element.value && element.value.match(options.pattern);
            } else if (options.hasOwnProperty('compareTo') && options.compareTo) {
                condition = element.value && element.value === options.compareTo;
            } else if (options.hasOwnProperty('checkProperty') && options.checkProperty) {
                condition = options.checkProperty;
            }
        }

        if (condition) {
            element.classList.remove('is-invalid');
            return true;
        } else {
            element.classList.add('is-invalid');
            return false;
        }
    }
}
