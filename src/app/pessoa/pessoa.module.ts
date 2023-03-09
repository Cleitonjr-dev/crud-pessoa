import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { PessoaService } from './services/pessoa.service';
import { ListarPessoaComponent } from './listar-pessoa/listar-pessoa.component';

import { ButtonModule } from 'primeng/button';
import { InserirPessoaComponent } from './inserir-pessoa/inserir-pessoa.component';
import { EditarPessoaComponent } from './editar-pessoa/editar-pessoa.component';
import { NumericoDirective } from '../shared/directives/numerico.directive';
import { MinimoValidatorDirective } from '../shared/directives/minimo-validator.directive';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';





@NgModule({
  declarations: [
    ListarPessoaComponent,
    InserirPessoaComponent,
    EditarPessoaComponent,
    NumericoDirective,
    MinimoValidatorDirective,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    NgxMaskDirective,
    NgxMaskPipe

  ],
  providers: [
    PessoaService,
    provideNgxMask()
  ]
})
export class PessoaModule { }
