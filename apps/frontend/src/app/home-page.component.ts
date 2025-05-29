import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "uc-home-page",
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            :host {
                display: block;
            }
        `,
    ],
    template: `<p>home-page works!</p>`,
})
export class HomePageComponent {}
