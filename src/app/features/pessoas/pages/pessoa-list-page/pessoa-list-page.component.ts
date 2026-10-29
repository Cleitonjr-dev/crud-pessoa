import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DialogComponent } from '../../components/dialog/dialog.component';
import { Pessoa } from '../../models/pessoa.model';
import { PessoasStore } from '../../state/pessoas.store';
import { maskDate } from '../../utils/data-nascimento';

@Component({
  selector: 'app-pessoa-list-page',
  imports: [RouterLink, DialogComponent],
  templateUrl: './pessoa-list-page.component.html',
})
export class PessoaListPageComponent {
  protected readonly store = inject(PessoasStore);

  protected readonly viewing = signal<Pessoa | null>(null);
  protected readonly removing = signal<Pessoa | null>(null);

  protected readonly formatDate = maskDate;

  protected confirmRemove(pessoa: Pessoa, dialog: DialogComponent): void {
    this.store.remove(pessoa.id);
    dialog.close();
  }
}
