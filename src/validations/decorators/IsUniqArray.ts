import { registerDecorator } from 'class-validator';
import equal from '@tinkoff/utils/is/equal';
import isArray from '@tinkoff/utils/is/array';

export function IsUniqArray() {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isUniqArray",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} should be a uniq array`
            },
            validator: {
                validate(value: any) {
                    return isArray(value) && equal(value, [...new Set([...value])]);
                }
            }
        });
    };
}
