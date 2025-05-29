import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, model, Signal, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { EntityWorkspace } from "@entity-space/common";
import { AlbumDto, AlbumDtoBlueprint, ArtistDto, ArtistDtoBlueprint, SongDto, SongDtoBlueprint } from "@unchaos/common";
import {
    catchAndShowError,
    isDefined,
    nzTableQueryParamsToCriteria,
    SearchBoxComponent,
    toNzTableFilterListItem,
} from "@unchaos/frontend/common";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzTableFilterList, NzTableModule, NzTableQueryParams } from "ng-zorro-antd/table";
import { debounceTime, delay, finalize, ReplaySubject, switchMap } from "rxjs";

@Component({
    selector: "uc-music-page",
    imports: [CommonModule, FormsModule, NzTableModule, NzInputModule, NzIconModule, NzSpaceModule, SearchBoxComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            :host {
                display: block;
            }

            nz-space {
                width: 100%;
            }
        `,
    ],
    template: `
        <nz-space nzDirection="vertical">
            <uc-search-box *nzSpaceItem [(ngModel)]="searchText" placeholder="Search Songs" />
            <nz-table
                *nzSpaceItem
                nzShowSizeChanger
                [nzData]="filteredSongs()"
                [nzLoading]="loading()"
                (nzQueryParams)="onQueryParamsChange($event)"
            >
                <thead>
                    <th>Name</th>
                    <th nzColumnKey="artistId" [nzFilters]="artistFilterOptions()" [nzFilterFn]="true">Artist</th>
                    <th nzColumnKey="albumId" [nzFilters]="albumFilterOptions()" [nzFilterFn]="true">Album</th>
                    <th>YouTube</th>
                </thead>
                <tbody>
                    @for (song of filteredSongs(); track song.id) {
                        <tr>
                            <td>{{ song.name }}</td>
                            <td>{{ song.artist?.name }}</td>
                            <td>{{ song.album?.name }}</td>
                            <td>
                                <a *ngIf="song.youtube" [href]="song.youtube" target="_blank">{{ song.youtube }}</a>
                            </td>
                        </tr>
                    }
                </tbody>
            </nz-table>
        </nz-space>
    `,
})
export class MusicPageComponent {
    constructor(
        private readonly workspace: EntityWorkspace,
        private readonly messageService: NzMessageService,
    ) {
        this.artists = toSignal(this.workspace.from(ArtistDtoBlueprint).get$(), { initialValue: [] });
        this.albums = toSignal(this.workspace.from(AlbumDtoBlueprint).get$(), { initialValue: [] });
    }

    searchText = model("");
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

            return this.workspace
                .from(SongDtoBlueprint)
                .where({ albumId, artistId })
                .select({ album: true, artist: true })
                .get$()
                .pipe(
                    delay(250),
                    catchAndShowError<SongDto[]>(this.messageService, []),
                    finalize(() => {
                        this.loading.set(false);
                    }),
                );
        }),
    );

    songs = toSignal(this.songs$, { initialValue: [] });

    filteredSongs = computed(() => {
        const searchText = this.searchText();
        return this.songs().filter(song => this.filterSong(song, searchText));
    });

    onQueryParamsChange(params: NzTableQueryParams): void {
        this.queryParams$.next(params);
    }

    // [todo] add "matchesKeywords()" utility
    // [todo] consider adding filter functionality to blueprint metadata
    filterSong(song: SongDto, searchText: string): boolean {
        const keywords = searchText
            .split(" ")
            .filter(str => str.length)
            .map(str => str.toLocaleLowerCase());

        const subject = [song.name, song.artist?.name, song.album?.name]
            .filter(isDefined)
            .map(str => str.toLocaleLowerCase())
            .join("");

        return keywords.every(keyword => subject.includes(keyword));
    }
}
