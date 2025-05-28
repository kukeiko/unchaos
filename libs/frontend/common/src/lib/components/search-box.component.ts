import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ControlValueAccessor, FormsModule } from "@angular/forms";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { ngModelProvider } from "../utils";

@Component({
    selector: "uc-search-box",
    imports: [CommonModule, FormsModule, NzInputModule, NzIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ngModelProvider(SearchBoxComponent)],
    styles: `
        :host {
            display: block;
        }
    `,
    template: `
        <nz-input-group [nzSuffix]="suffixIconSearch">
            <input
                type="text"
                nz-input
                placeholder="input search text"
                [disabled]="disabled()"
                [(ngModel)]="value"
                (ngModelChange)="onChange($event)"
                (blur)="onTouched()"
            />
        </nz-input-group>
        <ng-template #suffixIconSearch>
            <nz-icon nzType="search" />
        </ng-template>
    `,
})
export class SearchBoxComponent implements ControlValueAccessor {
    onChange: (value: string) => void = () => {};
    onTouched: () => void = () => {};

    value = signal("");
    disabled = signal(false);

    writeValue(value: string): void {
        this.value.set(value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }
}
