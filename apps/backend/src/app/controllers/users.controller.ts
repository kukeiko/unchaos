import { EntityWorkspace } from "@entity-space/common";
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { UserDto, UserDtoBlueprint } from "@unchaos/common";

@Controller("users")
export class UsersController {
    constructor(private readonly workspace: EntityWorkspace) {}

    @Get()
    getUsers(): Promise<UserDto[]> {
        return this.workspace.from(UserDtoBlueprint).get();
    }

    @Get(":id")
    getUserById(@Param("id", ParseIntPipe) id: number): Promise<UserDto> {
        // [todo] throw 404 instead: add ability to entity-space to customize thrown errors
        // or add an interceptor that can identify the "NotFound" error and map it
        return this.workspace.from(UserDtoBlueprint).where({ id }).getOne();
    }
}
