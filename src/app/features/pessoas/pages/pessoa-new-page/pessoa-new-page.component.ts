import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PessoaFormComponent } from '../../components/pessoa-form/pessoa-form.component';
import { PessoaDados } from '../../models/pessoa.model';
import { PessoasStore } from '../../state/pessoas.store';

@Component({
  selector: 'app-pessoa-new-page',
  imports: [PessoaFormComponent],
  templateUrl: './pessoa-new-page.component.html',
})
export class PessoaNewPageComponent {
  protected readonly store = inject(PessoasStore);
  private readonly router = inject(Router);

  protected save(dados: PessoaDados): void {
    if (this.store.add(dados)) {
      this.router.navigate(['/pessoas/listas']);
    }
  }
}
