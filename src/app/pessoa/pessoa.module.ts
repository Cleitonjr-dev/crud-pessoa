import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { PessoaService } from './services/pessoa.service';
import { ListarPessoaComponent } from './listar-pessoa/listar-pessoa.component';

import { ButtonModule } from 'primeng/button';
import { InserirPessoaComponent } from './inserir-pessoa/inserir-pessoa.component';
import { EditarPessoaComponent } from './editar-pessoa/editar-pessoa.component';


import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { SharedModule } from '../shared';
import { ModalPessoaComponent } from './modal-pessoa/modal-pessoa.component';





@NgModule({
  declarations: [
    ListarPessoaComponent,
    InserirPessoaComponent,
    EditarPessoaComponent,
    ModalPessoaComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SharedModule

  ],
  providers: [
    PessoaService,
    provideNgxMask()
  ]
})
export class PessoaModule { }
