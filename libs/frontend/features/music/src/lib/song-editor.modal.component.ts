import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EntityWorkspace } from "@entity-space/common";
import {
    AlbumDtoBlueprint,
    ArtistDtoBlueprint,
    SongCreatableDto,
    SongDtoBlueprint,
    SongUpdatableDto,
} from "@unchaos/common";
import { getErrorMessage, sleep } from "@unchaos/frontend/common";
import { isEqual } from "lodash";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { distinctUntilChanged, map, of, switchMap } from "rxjs";

@Component({
    selector: "uc-music-song-editor-modal",
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzModalModule,
        NzButtonModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        NzSpaceModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            :host {
                display: block;
            }
        `,
    ],
    template: `
        <nz-modal
            [nzVisible]="isVisible() && song()"
            [nzTitle]="title()"
            nzDraggable
            (nzOnCancel)="onCancel()"
            (nzOnOk)="onOk()"
            nzWidth="800px"
        >
            <nz-space *nzModalContent>
                <form *nzSpaceItem nz-form [formGroup]="form">
                    <nz-form-item>
                        <nz-form-label nzRequired>Name</nz-form-label>
                        <nz-form-control>
                            <input type="text" nz-input formControlName="name" />
                        </nz-form-control>
                    </nz-form-item>
                    <nz-form-item>
                        <nz-form-label nzRequired>Artist</nz-form-label>
                        <nz-form-control>
                            <nz-select
                                nzShowSearch
                                nzPlaceHolder="Select an Artist"
                                formControlName="artistId"
                                (ngModelChange)="onArtistChange()"
                            >
                                @for (artist of artists(); track artist.id) {
                                    <nz-option [nzLabel]="artist.name" [nzValue]="artist.id"></nz-option>
                                }
                            </nz-select>
                        </nz-form-control>
                    </nz-form-item>
                    <nz-form-item>
                        <nz-form-label nzRequired>Album</nz-form-label>
                        <nz-form-control>
                            <nz-select nzShowSearch nzPlaceHolder="Select an Album" formControlName="albumId">
                                @for (album of albums(); track album.id) {
                                    <nz-option [nzLabel]="album.name" [nzValue]="album.id"></nz-option>
                                }
                            </nz-select>
                        </nz-form-control>
                    </nz-form-item>
                </form>

                <nz-space *nzSpaceItem nzDirection="vertical">
                    <pre *nzSpaceItem>{{ song() | json }}</pre>
                    <pre *nzSpaceItem>{{ formSong() | json }}</pre>
                </nz-space>
            </nz-space>
        </nz-modal>
    `,
})
export class SongEditorModalComponent implements OnInit {
    formBuilder = inject(FormBuilder);
    route = inject(ActivatedRoute);
    router = inject(Router);
    workspace = inject(EntityWorkspace);
    messageService = inject(NzMessageService);
    destroyRef = inject(DestroyRef);

    songId = signal<number | undefined>(undefined);
    title = computed(() => (this.songId() ? `Edit Song #${this.songId()}` : "New Song"));
    isVisible = signal(true);
    artists = toSignal(this.workspace.from(ArtistDtoBlueprint).get$());
    song = signal<SongCreatableDto | undefined>(undefined);

    form = new FormGroup({
        name: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
        artistId: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
        albumId: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
        youtube: new FormControl("", { nonNullable: true }),
    });

    formSong = toSignal(this.form.valueChanges.pipe(distinctUntilChanged((a, b) => isEqual(a, b))));

    albums = toSignal(
        toObservable(this.formSong).pipe(
            map(formSong => formSong?.artistId),
            distinctUntilChanged(),
            switchMap(artistId => {
                if (artistId) {
                    return this.workspace.from(AlbumDtoBlueprint).where({ artistId }).get$();
                } else {
                    return of([]);
                }
            }),
        ),
    );

    async ngOnInit(): Promise<void> {
        const id = +this.route.snapshot.params["id"];
        this.songId.set(id);
        const song = await (id
            ? this.workspace.from(SongDtoBlueprint).where({ id }).getOne()
            : this.workspace.from(SongDtoBlueprint).constructCreatable());

        this.form.patchValue(song);
        this.song.set(song);
    }

    onArtistChange(): void {
        this.form.controls.albumId.setValue(0);
    }

    async onOk(): Promise<void> {
        const formSong = this.form.getRawValue();

        if (!formSong || !this.form.valid) {
            return;
        }

        const song = { ...this.song(), ...formSong };

        try {
            if (!this.songId()) {
                const created = await this.workspace.in(SongDtoBlueprint).createOne(song);
                console.log("created song", created);
            } else {
                // [todo] cast
                const updated = await this.workspace.in(SongDtoBlueprint).updateOne(song as SongUpdatableDto);
                console.log("updated song", updated);
            }

            await this.close();
        } catch (error) {
            this.messageService.error(getErrorMessage(error));
        }
    }

    onCancel(): void {
        this.close();
    }

    async close(): Promise<void> {
        this.isVisible.set(false);
        await sleep(250);
        this.router.navigate(["../.."], { relativeTo: this.route });
    }
}
