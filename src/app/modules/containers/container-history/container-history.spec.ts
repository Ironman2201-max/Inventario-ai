import { ComponentFixture, TestBed, provideHttpClientTesting } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ContainerHistory } from './container-history';

describe('ContainerHistory', () => {
  let component: ContainerHistory;
  let fixture: ComponentFixture<ContainerHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerHistory],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
