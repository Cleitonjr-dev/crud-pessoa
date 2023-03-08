import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarPessoaComponent } from './pessoa/listar-pessoa/listar-pessoa.component';
import { InserirPessoaComponent } from './pessoa/inserir-pessoa/inserir-pessoa.component';
import { EditarPessoaComponent } from './pessoa/editar-pessoa/editar-pessoa.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'pessoas/listas',
    pathMatch: 'full',
  },

  {
    path: 'pessoas',
    redirectTo: 'pessoas/listas',
  },

  {
    path: 'pessoas/listas',
    component: ListarPessoaComponent,
  },

  {
    path: 'pessoas/novo',
    component: InserirPessoaComponent
  },

  {
    path: 'pessoas/editar/:id',
    component: EditarPessoaComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


