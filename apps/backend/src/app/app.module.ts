import { EntityServiceContainer, EntityWorkspace } from "@entity-space/common";
import { MiddlewareConsumer, Module, NestModule, OnModuleInit, Provider, Type } from "@nestjs/common";
import { AlbumsController } from "./controllers/albums.controller";
import { ArtistsController } from "./controllers/artists.controller";
import { SongsController } from "./controllers/songs.controller";
import { UsersController } from "./controllers/users.controller";
import { AsyncStoreMiddleware } from "./middleware/async-store.middleware";
import { EnableTraceQueriesMiddleware } from "./middleware/enable-trace-queries.middleware";
import { AlbumRepository } from "./repositories/album.repository";
import { ArtistRepository } from "./repositories/artist.repository";
import { SongRepository } from "./repositories/song.repository";
import { UserRepository } from "./repositories/user.repository";
import { AsyncStoreService } from "./services/async-store.service";
import { EntityService } from "./services/entity.service";

const ENTITY_SPACE: Provider[] = [
    { provide: EntityServiceContainer, useValue: new EntityServiceContainer() },
    {
        provide: EntityWorkspace,
        inject: [EntityServiceContainer],
        useFactory: (services: EntityServiceContainer) => new EntityWorkspace(services),
    },
];

const REPOSITORIES: Provider[] = [ArtistRepository, AlbumRepository, SongRepository, UserRepository];
const CONTROLLERS: Type[] = [AlbumsController, ArtistsController, UsersController, SongsController];
const SERVICES: Provider[] = [AsyncStoreService, EntityService];

@Module({
    controllers: [...CONTROLLERS],
    providers: [...ENTITY_SPACE, ...SERVICES, ...REPOSITORIES],
})
export class AppModule implements NestModule, OnModuleInit {
    constructor(private readonly entityService: EntityService) {}

    onModuleInit(): void {
        this.entityService.useArtists().useAlbums().useSongs().useUsers();
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AsyncStoreMiddleware).forRoutes("*");
        consumer.apply(EnableTraceQueriesMiddleware).forRoutes("*");
    }
}
