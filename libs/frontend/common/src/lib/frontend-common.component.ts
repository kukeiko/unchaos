import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: "lib-frontend-common",
    imports: [CommonModule],
    template: `<p>FrontendCommon works!</p>`,
    styles: `
        :host {
            display: block;
        }
    `,
})
export class FrontendCommonComponent {}
