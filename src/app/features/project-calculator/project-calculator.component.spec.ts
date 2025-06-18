import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCalculatorComponent } from './project-calculator.component';

describe('ProjectCalculatorComponent', () => {
  let component: ProjectCalculatorComponent;
  let fixture: ComponentFixture<ProjectCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
