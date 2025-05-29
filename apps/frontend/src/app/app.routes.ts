import { Routes } from "@angular/router";
import { HomePageComponent } from "./home-page.component";

export const appRoutes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "/home" },
    {
        path: "home",
        component: HomePageComponent,
    },
    {
        path: "music",
        loadChildren: () => import("@unchaos/frontend/music").then(c => c.routes),
    },
    {
        path: "sandbox",
        loadChildren: () => import("@unchaos/frontend/sandbox").then(c => c.routes),
    },
];
