import { registerDecorator } from 'class-validator';
import last from '@tinkoff/utils/array/last';

export function IsPicture() {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isPicture",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} should be an image`
            },
            validator: {
                validate(value: string) {
                    const [name, ...rest] = value.split('.');
                    const extension = last(rest);

                    return name && ['jpeg', 'jpg', 'png', 'webp'].includes(extension)
                }
            }
        });
    };
}
