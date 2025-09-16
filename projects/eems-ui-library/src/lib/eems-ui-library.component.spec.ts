import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EemsUiLibraryComponent } from './eems-ui-library.component';

describe('EemsUiLibraryComponent', () => {
  let component: EemsUiLibraryComponent;
  let fixture: ComponentFixture<EemsUiLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EemsUiLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EemsUiLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
