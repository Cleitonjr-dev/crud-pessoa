import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pessoas/listas' },
  { path: 'pessoas', pathMatch: 'full', redirectTo: 'pessoas/listas' },
  {
    path: 'pessoas/listas',
    title: 'Pessoas · Cadastro de Pessoas',
    loadComponent: () =>
      import('./features/pessoas/pages/pessoa-list-page/pessoa-list-page.component').then(
        (m) => m.PessoaListPageComponent,
      ),
  },
  {
    path: 'pessoas/novo',
    title: 'Nova pessoa · Cadastro de Pessoas',
    loadComponent: () =>
      import('./features/pessoas/pages/pessoa-new-page/pessoa-new-page.component').then(
        (m) => m.PessoaNewPageComponent,
      ),
  },
  {
    path: 'pessoas/editar/:id',
    title: 'Editar pessoa · Cadastro de Pessoas',
    loadComponent: () =>
      import('./features/pessoas/pages/pessoa-edit-page/pessoa-edit-page.component').then(
        (m) => m.PessoaEditPageComponent,
      ),
  },
  {
    path: '**',
    title: 'Página não encontrada · Cadastro de Pessoas',
    loadComponent: () =>
      import('./features/pessoas/pages/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent,
      ),
  },
];
