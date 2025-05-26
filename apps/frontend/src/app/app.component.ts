import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { common } from "@unchaos/common";
import { lastValueFrom } from "rxjs";
import { NxWelcomeComponent } from "./nx-welcome.component";

@Component({
    imports: [NxWelcomeComponent, RouterModule],
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    constructor(private readonly httpClient: HttpClient) {}

    title = "unchaos";
    test = common();

    async ngOnInit(): Promise<void> {
        const response = await lastValueFrom(this.httpClient.get("/api/common"));
        console.log(response);
    }
}
