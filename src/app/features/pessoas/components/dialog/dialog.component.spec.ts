import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { stubDialog } from '../../../../core/testing/dialog-stub';

@Component({
  imports: [DialogComponent],
  template: `
    <app-dialog #dialog heading="Título" (closed)="closedCount = closedCount + 1">
      <button type="button" (click)="dialog.close()">Fechar</button>
    </app-dialog>
  `,
})
class HostComponent {
  public closedCount = 0;
}

describe('DialogComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const dialog = () => fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;

  beforeEach(async () => {
    stubDialog();
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should open as a modal with its heading and projected content', () => {
    expect(dialog().hasAttribute('open')).toBe(true);
    expect(dialog().getAttribute('aria-labelledby')).toBe('dialog-title');
    expect(dialog().querySelector('#dialog-title')?.textContent).toBe('Título');
    expect(dialog().querySelector('button')?.textContent).toBe('Fechar');
  });

  it('should tell the parent when it closes', () => {
    dialog().querySelector('button')!.click();

    expect(dialog().hasAttribute('open')).toBe(false);
    expect(fixture.componentInstance.closedCount).toBe(1);
  });

  it('should close when the backdrop is clicked, but not when the content is', () => {
    dialog()
      .querySelector('#dialog-title')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(fixture.componentInstance.closedCount).toBe(0);

    dialog().dispatchEvent(new MouseEvent('click'));
    expect(fixture.componentInstance.closedCount).toBe(1);
  });
});
