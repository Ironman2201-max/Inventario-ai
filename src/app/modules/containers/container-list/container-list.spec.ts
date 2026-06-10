import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerList } from './container-list';

describe('ContainerList', () => {
  let component: ContainerList;
  let fixture: ComponentFixture<ContainerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerList],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
