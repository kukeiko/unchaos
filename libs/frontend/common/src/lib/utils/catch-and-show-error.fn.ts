import { HttpErrorResponse } from "@angular/common/http";
import { NzMessageService } from "ng-zorro-antd/message";
import { catchError, MonoTypeOperatorFunction, Observable, of } from "rxjs";
import { getErrorMessage } from "./get-error-message.fn";

export function catchAndShowError<T>(messageService: NzMessageService, defaultValue: T): MonoTypeOperatorFunction<T> {
    return (source$: Observable<T>): Observable<T> => {
        return source$.pipe(
            catchError((error: Error | HttpErrorResponse) => {
                messageService.error(getErrorMessage(error));
                return of(defaultValue);
            }),
        );
    };
}
