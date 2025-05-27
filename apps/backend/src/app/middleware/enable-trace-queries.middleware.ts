import { EntityServiceContainer } from "@entity-space/common";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AsyncStoreService } from "../services/async-store.service";

@Injectable()
export class EnableTraceQueriesMiddleware implements NestMiddleware {
    constructor(
        private readonly asyncStoreService: AsyncStoreService,
        private readonly entityServices: EntityServiceContainer,
    ) {}

    use(request: Request, response: Response, next: NextFunction) {
        this.entityServices.getTracing().enableConsole(this.asyncStoreService.getTraceQueries());
        next();
    }
}
