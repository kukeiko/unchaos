import { HttpErrorResponse } from "@angular/common/http";

export function getErrorMessage(error: Error | HttpErrorResponse | unknown): string {
    if (error instanceof HttpErrorResponse) {
        return error.error?.message ?? error.message; // NestJS error
    } else if (error instanceof Error) {
        return error.message; // everything else
    } else {
        return `${error}`;
    }
}
