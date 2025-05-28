import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, computed, Signal, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { AlbumDto, ArtistDto, SongDto } from "@unchaos/common";
import {
    catchAndShowError,
    nzTableQueryParamsToCriteria,
    toNzTableFilterListItem,
    toQueryParams,
} from "@unchaos/frontend/common";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzTableFilterList, NzTableModule, NzTableQueryParams } from "ng-zorro-antd/table";
import { debounceTime, delay, finalize, ReplaySubject, switchMap } from "rxjs";

@Component({
    selector: "uc-music-page",
    imports: [CommonModule, NzTableModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            :host {
                display: block;
            }
        `,
    ],
    template: `
        <nz-table
            nzShowSizeChanger
            [nzData]="songs()"
            [nzLoading]="loading()"
            (nzQueryParams)="onQueryParamsChange($event)"
        >
            <thead>
                <th>Name</th>
                <th nzColumnKey="artistId" [nzFilters]="artistFilterOptions()" [nzFilterFn]="true">Artist</th>
                <th nzColumnKey="albumId" [nzFilters]="albumFilterOptions()" [nzFilterFn]="true">Album</th>
            </thead>
            <tbody>
                @for (song of songs(); track song.id) {
                    <tr>
                        <td>{{ song.name }}</td>
                        <td>{{ song.artist?.name }}</td>
                        <td>{{ song.album?.name }}</td>
                    </tr>
                }
            </tbody>
        </nz-table>
    `,
})
export class MusicPageComponent {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly messageService: NzMessageService,
    ) {
        this.artists = toSignal(this.httpClient.get<ArtistDto[]>("/api/artists"), { initialValue: [] });
        this.albums = toSignal(this.httpClient.get<AlbumDto[]>("/api/albums"), { initialValue: [] });
    }

    artists: Signal<ArtistDto[]>;
    albums: Signal<AlbumDto[]>;
    loading = signal(false);
    asSong: (song: SongDto) => SongDto = song => song;

    artistFilterOptions = computed<NzTableFilterList>(() => this.artists().map(toNzTableFilterListItem));
    albumFilterOptions = computed<NzTableFilterList>(() => this.albums().map(toNzTableFilterListItem));

    queryParams$ = new ReplaySubject<NzTableQueryParams>(1);
    songs$ = this.queryParams$.pipe(
        debounceTime(25),
        switchMap(queryParams => {
            const { albumId, artistId } = nzTableQueryParamsToCriteria<{
                artistId: number[];
                albumId: number[];
            }>(queryParams);

            this.loading.set(true);

            return this.httpClient
                .get<
                    SongDto[]
                >("api/songs", { params: toQueryParams({ album: true, artist: true, albumId, artistId }) })
                .pipe(
                    delay(1000),
                    catchAndShowError<SongDto[]>(this.messageService, []),
                    finalize(() => {
                        this.loading.set(false);
                    }),
                );
        }),
    );

    songs = toSignal(this.songs$, { initialValue: [] });

    onQueryParamsChange(params: NzTableQueryParams): void {
        this.queryParams$.next(params);
    }
}
