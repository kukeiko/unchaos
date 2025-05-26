import { JsonPipe, NgFor } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ArtistDto, common } from "@unchaos/common";
import { lastValueFrom } from "rxjs";
import { NxWelcomeComponent } from "./nx-welcome.component";

@Component({
    imports: [NxWelcomeComponent, RouterModule, NgFor, JsonPipe],
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    constructor(private readonly httpClient: HttpClient) {}

    title = "unchaos";
    test = common();
    artists: ArtistDto[] = [];

    async ngOnInit(): Promise<void> {
        this.artists = await lastValueFrom(this.httpClient.get<ArtistDto[]>("/api/artists"));
    }
}
