import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FrontendCommonComponent } from "./frontend-common.component";

describe("FrontendCommonComponent", () => {
    let component: FrontendCommonComponent;
    let fixture: ComponentFixture<FrontendCommonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FrontendCommonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FrontendCommonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
