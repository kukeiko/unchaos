import { Routes } from "@angular/router";

export const appRoutes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "/home" },
    {
        path: "home",
        loadChildren: () => import("./components/pages/home-page/home-page.routes").then(m => m.homePageRoutes),
    },
    {
        path: "music",
        loadChildren: () => import("./components/pages/music-page/music-page.routes").then(c => c.musicPageRoutes),
    },
];
