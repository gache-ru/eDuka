import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResourceManagementComponent } from './admin-resource-management.component';

describe('AdminResourceManagementComponent', () => {
  let component: AdminResourceManagementComponent;
  let fixture: ComponentFixture<AdminResourceManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminResourceManagementComponent]
    });
    fixture = TestBed.createComponent(AdminResourceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
