import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { providePrimeNG } from "primeng/config";
import { appRoutes } from "./app.routes";
import { UnchaosPreset } from "./unchaos-theme-preset";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideHttpClient(),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: UnchaosPreset,
                options: {
                    darkModeSelector: "uc-dark-mode",
                },
            },
        }),
    ],
};
