import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCourseRepsComponent } from './manage-course-reps.component';

describe('ManageCourseRepsComponent', () => {
  let component: ManageCourseRepsComponent;
  let fixture: ComponentFixture<ManageCourseRepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCourseRepsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCourseRepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
