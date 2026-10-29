import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { PessoaFormComponent } from '../../components/pessoa-form/pessoa-form.component';
import { PessoaDados } from '../../models/pessoa.model';
import { PessoasStore } from '../../state/pessoas.store';

@Component({
  selector: 'app-pessoa-edit-page',
  imports: [PessoaFormComponent, RouterLink],
  templateUrl: './pessoa-edit-page.component.html',
})
export class PessoaEditPageComponent {
  protected readonly store = inject(PessoasStore);
  private readonly router = inject(Router);

  /** Parâmetro `:id` da rota, entregue por `withComponentInputBinding`. */
  public readonly id = input.required<string>();

  protected readonly pessoa = computed(() => this.store.getById(Number(this.id())));

  protected save(dados: PessoaDados): void {
    const pessoa = this.pessoa();

    if (pessoa && this.store.update(pessoa.id, dados)) {
      this.router.navigate(['/pessoas/listas']);
    }
  }
}
