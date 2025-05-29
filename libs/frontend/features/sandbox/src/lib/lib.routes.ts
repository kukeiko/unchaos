import { Route } from "@angular/router";
import { NzDemoTableAjaxComponent } from "./nz-demo-table-ajax.component";
import { SandboxPageComponent } from "./sandbox-page.component";

export const routes: Route[] = [
    {
        path: "",
        component: SandboxPageComponent,
        children: [{ path: "table/ajax", component: NzDemoTableAjaxComponent }],
    },
];
