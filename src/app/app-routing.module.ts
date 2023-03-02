import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarPessoaComponent } from './pessoa/listar-pessoa/listar-pessoa.component';


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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

Angular - 11.06 - CRUD - Implementar o Componente de Listagem, CONTINUAR DO MINUTO 1:30
https://www.youtube.com/watch?v=7Rd_rVCjzBk&list=PLCFVce0QedSZWvwmz1bsXN0kEG2ePnKu6&index=24
