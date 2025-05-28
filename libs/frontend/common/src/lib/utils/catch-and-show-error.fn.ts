import { HttpErrorResponse } from "@angular/common/http";
import { NzMessageService } from "ng-zorro-antd/message";
import { catchError, MonoTypeOperatorFunction, Observable, of } from "rxjs";

function getErrorMessage(error: Error | HttpErrorResponse): string {
    if (error instanceof HttpErrorResponse) {
        return error.error.message; // NestJS error
    } else {
        return error.message; // everything else
    }
}
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
