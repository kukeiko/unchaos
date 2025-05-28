import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit, signal } from "@angular/core";
import { SongDto } from "@unchaos/common";
import { NzTableModule } from "ng-zorro-antd/table";
import { lastValueFrom } from "rxjs";

@Component({
    selector: "uc-music-page",
    imports: [CommonModule, NzTableModule],
    templateUrl: "./music-page.component.html",
    styleUrl: "./music-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicPageComponent implements OnInit {
    constructor(private readonly httpClient: HttpClient) {}

    async ngOnInit(): Promise<void> {
        const songs = await lastValueFrom(this.httpClient.get<SongDto[]>("/api/songs"));
        this.songs.set(songs);
    }

    songs = signal<SongDto[]>([]);
    asSong: (song: SongDto) => SongDto = song => song;
}
