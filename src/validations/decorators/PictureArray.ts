import { registerDecorator } from 'class-validator';
import last from '@tinkoff/utils/array/last';

export function PictureArray() {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "pictureArray",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} should be an array of images`
            },
            validator: {
                validate(value: string[]) {
                    return value.every(image => {
                        const [name, ...rest] = image.split('.');
                        const extension = last(rest);

                        return name && ['jpeg', 'jpg', 'png', 'webp'].includes(extension)
                    })
                }
            }
        });
    };
}
