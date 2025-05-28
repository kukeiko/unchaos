import { registerLocaleData } from "@angular/common";
import { provideHttpClient } from "@angular/common/http";
import en from "@angular/common/locales/en";
import { ApplicationConfig, Provider, provideZoneChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { EntityServiceContainer, EntityWorkspace } from "@entity-space/common";
import { en_US, provideNzI18n } from "ng-zorro-antd/i18n";
import { provideNzIcons } from "ng-zorro-antd/icon";
import { providePrimeNG } from "primeng/config";
import { appRoutes } from "./app.routes";
import { icons } from "./icons-provider";
import { UnchaosPreset } from "./unchaos-theme-preset";

registerLocaleData(en);

// [todo] add "@entity-space/angular" which exports provideEntitySpace()
const ENTITY_SPACE: Provider[] = [
    { provide: EntityServiceContainer, useValue: new EntityServiceContainer() },
    {
        provide: EntityWorkspace,
        deps: [EntityServiceContainer],
        useFactory: (services: EntityServiceContainer) => new EntityWorkspace(services),
    },
];

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
        ...ENTITY_SPACE,
    ],
};
