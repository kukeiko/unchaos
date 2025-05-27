import { EntityServiceContainer, EntityWorkspace } from "@entity-space/common";
import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArtistsController } from "./controllers/artists.controller";
import { UsersController } from "./controllers/users.controller";
import { AsyncStoreMiddleware } from "./middleware/async-store.middleware";
import { ArtistRepository } from "./repositories/artist.repository";
import { UserRepository } from "./repositories/user.repository";
import { AsyncStoreService } from "./services/async-store.service";
import { EntityService } from "./services/entity.service";

@Module({
    imports: [],
    controllers: [AppController, ArtistsController, UsersController],
    providers: [
        AsyncStoreService,
        AppService,
        EntityService,
        ArtistRepository,
        UserRepository,
        { provide: EntityServiceContainer, useValue: new EntityServiceContainer() },
        {
            provide: EntityWorkspace,
            inject: [EntityServiceContainer],
            useFactory: (services: EntityServiceContainer) => new EntityWorkspace(services),
        },
    ],
})
export class AppModule implements NestModule, OnModuleInit {
    constructor(private readonly entityService: EntityService) {}

    onModuleInit(): void {
        this.entityService.useArtists().useUsers();
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AsyncStoreMiddleware).forRoutes("*");
    }
}
