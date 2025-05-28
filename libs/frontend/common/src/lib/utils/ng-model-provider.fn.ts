import { Provider, Type } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

export function ngModelProvider(component: Type<any>): Provider {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: component,
        multi: true,
    };
}
