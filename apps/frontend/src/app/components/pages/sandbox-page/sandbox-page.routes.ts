import { Route } from "@angular/router";
import { NzDemoTableAjaxComponent } from "../../nz-examples/nz-demo-table-ajax.component";
import { SandboxPageComponent } from "./sandbox-page.component";

export const sandboxPageRoutes: Route[] = [
    { path: "", component: SandboxPageComponent, children: [{ path: "table/ajax", component: NzDemoTableAjaxComponent }] },
];
