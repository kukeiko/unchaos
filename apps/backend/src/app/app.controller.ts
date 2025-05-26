import { Controller, Get } from "@nestjs/common";
import { common } from "@unchaos/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getData() {
        return this.appService.getData();
    }

    @Get("common")
    getCommon() {
        return { foo: common() };
    }
}
