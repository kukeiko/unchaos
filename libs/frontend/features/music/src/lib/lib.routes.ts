import { Route } from "@angular/router";
import { MusicPageComponent } from "./music-page.component";
import { SongEditorModalComponent } from "./song-editor.modal.component";

export const routes: Route[] = [
    {
        path: "",
        component: MusicPageComponent,
        children: [
            {
                path: "song/new",
                component: SongEditorModalComponent,
            },
            {
                path: "song/:id",
                component: SongEditorModalComponent,
            },
        ],
    },
];
