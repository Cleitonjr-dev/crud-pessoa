import { Component, ElementRef, afterNextRender, input, output, viewChild } from '@angular/core';

/** Janela de diálogo nativa (<dialog>): abre ao ser criada, fecha com Esc, botão ou clique fora. */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  public readonly heading = input.required<string>();
  public readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }

  public close(): void {
    this.dialog().nativeElement.close();
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }
}
