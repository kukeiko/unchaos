import { ArgumentMetadata, HttpStatus, Injectable, Optional, PipeTransform } from "@nestjs/common";
import { ErrorHttpStatusCode, HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";
import { isNil } from "@nestjs/common/utils/shared.utils";

export interface ParseOptionalTruePipeOptions {
    /**
     * The HTTP status code to be used in the response when the validation fails.
     */
    errorHttpStatusCode?: ErrorHttpStatusCode;
    /**
     * A factory function that returns an exception object to be thrown
     * if validation fails.
     * @param error Error message
     * @returns The exception object
     */
    exceptionFactory?: (error: string) => any;
}

@Injectable()
export class ParseOptionalTruePipe implements PipeTransform<string | boolean, Promise<true | undefined>> {
    protected exceptionFactory: (error: string) => any;

    constructor(@Optional() protected readonly options?: ParseOptionalTruePipeOptions) {
        options = options || {};
        const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } = options;
        this.exceptionFactory = exceptionFactory || (error => new HttpErrorByCode[errorHttpStatusCode](error));
    }

    /**
     * Method that accesses and performs optional transformation on argument for
     * in-flight requests.
     *
     * @param value currently processed route argument
     * @param metadata contains metadata about the currently processed route argument
     */
    async transform(value: string | boolean, metadata: ArgumentMetadata): Promise<true | undefined> {
        if (isNil(value)) {
            return value;
        } else if (this.isTrue(value)) {
            return true;
        }

        throw this.exceptionFactory("Validation failed (true string is expected)");
    }

    /**
     * @param value currently processed route argument
     * @returns `true` if `value` is said 'true', ie., if it is equal to the boolean
     * `true` or the string `"true"`
     */
    protected isTrue(value: string | boolean): boolean {
        return value === true || value === "true";
    }
}
