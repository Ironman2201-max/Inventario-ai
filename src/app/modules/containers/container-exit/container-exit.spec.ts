import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerExit } from './container-exit';

describe('ContainerExit', () => {
  let component: ContainerExit;
  let fixture: ComponentFixture<ContainerExit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerExit],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerExit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
