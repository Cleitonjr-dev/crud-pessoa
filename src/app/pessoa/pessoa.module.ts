import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { PessoaService } from './services/pessoa.service';
import { ListarPessoaComponent } from './listar-pessoa/listar-pessoa.component';

import { ButtonModule } from 'primeng/button';
import { InserirPessoaComponent } from './inserir-pessoa/inserir-pessoa.component';
   


@NgModule({
  declarations: [
    ListarPessoaComponent,
    InserirPessoaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,

  ],
  providers: [
    PessoaService
  ]
})
export class PessoaModule { }
