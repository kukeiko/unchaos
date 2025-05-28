import { registerLocaleData } from "@angular/common";
import { provideHttpClient } from "@angular/common/http";
import en from "@angular/common/locales/en";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { en_US, provideNzI18n } from "ng-zorro-antd/i18n";
import { provideNzIcons } from "ng-zorro-antd/icon";
import { providePrimeNG } from "primeng/config";
import { appRoutes } from "./app.routes";
import { icons } from "./icons-provider";
import { UnchaosPreset } from "./unchaos-theme-preset";

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideHttpClient(),
        provideAnimationsAsync(),
        provideNzIcons(icons),
        providePrimeNG({
            theme: {
                preset: UnchaosPreset,
                options: {
                    darkModeSelector: "uc-dark-mode",
                },
            },
        }),
        provideNzI18n(en_US),
    ],
};
