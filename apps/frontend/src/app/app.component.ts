import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { EntityServiceContainer } from "@entity-space/common";
import { EntityService } from "@unchaos/frontend/common";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";

@Component({
    selector: "uc-root",
    imports: [RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    constructor(entityServices: EntityServiceContainer, entityService: EntityService) {
        entityServices.getTracing().enableConsole();
        entityService.useArtists().useAlbums();
        entityService.useSongs(); // will load songs together w/ artist + albums in one request
        // entityService.useSongsNoExpand(); // will load artists + albums in separate requests
    }

    isCollapsed = false;
}
