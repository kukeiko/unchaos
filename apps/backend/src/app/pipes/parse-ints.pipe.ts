import { ArgumentMetadata, HttpStatus, Injectable, Optional, PipeTransform } from "@nestjs/common";
import { ErrorHttpStatusCode, HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";
import { isNil } from "@nestjs/common/utils/shared.utils";

export interface ParseIntPipeOptions {
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
    /**
     * If true, the pipe will return null or undefined if the value is not provided
     * @default false
     */
    optional?: boolean;
}

@Injectable()
export class ParseIntsPipe implements PipeTransform<string> {
    protected exceptionFactory: (error: string) => any;

    constructor(@Optional() protected readonly options?: ParseIntPipeOptions) {
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
    async transform(value: string, metadata: ArgumentMetadata): Promise<number[]> {
        if (isNil(value) && this.options?.optional) {
            return value;
        }

        const values = value.split(",");

        if (!values.every(value => this.isNumeric(value))) {
            throw this.exceptionFactory("Validation failed (numeric string array is expected)");
        }

        return values.map(value => parseInt(value, 10));
    }

    /**
     * @param value currently processed route argument
     * @returns `true` if `value` is a valid integer number
     */
    protected isNumeric(value: string): boolean {
        return ["string", "number"].includes(typeof value) && /^-?\d+$/.test(value) && isFinite(value as any);
    }
}
