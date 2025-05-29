import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "uc-sandbox-page",
    imports: [RouterOutlet],
    template: `<router-outlet></router-outlet>`,
})
export class SandboxPageComponent {}
