import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerRegister } from './container-register';

describe('ContainerRegister', () => {
  let component: ContainerRegister;
  let fixture: ComponentFixture<ContainerRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
