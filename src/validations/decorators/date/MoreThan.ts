import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function MoreThan(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "moreThan",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName] || new Date();

                    return new Date(value) > new Date(relatedValue);
                }
            }
        });
    };
}
