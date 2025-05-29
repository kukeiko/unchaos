import { Routes } from "@angular/router";

export const appRoutes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "/home" },
    {
        path: "home",
        loadChildren: () => import("./components/pages/home-page/home-page.routes").then(m => m.homePageRoutes),
    },
    {
        path: "music",
        loadChildren: () => import("@unchaos/frontend/music").then(c => c.routes),
    },
    {
        path: "sandbox",
        loadChildren: () =>
            import("./components/pages/sandbox-page/sandbox-page.routes").then(c => c.sandboxPageRoutes),
    },
];
