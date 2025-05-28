import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "uc-home-page",
    imports: [CommonModule],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
