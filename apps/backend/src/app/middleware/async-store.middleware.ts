import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AsyncStoreService } from "../services/async-store.service";

@Injectable()
export class AsyncStoreMiddleware implements NestMiddleware {
    constructor(private readonly asyncStoreService: AsyncStoreService) {}

    use(request: Request, response: Response, next: NextFunction) {
        this.asyncStoreService.run(() => {
            this.asyncStoreService.setUserId(1);
            next();
        });
    }
}
