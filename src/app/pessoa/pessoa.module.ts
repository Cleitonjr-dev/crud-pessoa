import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoaService } from './services/pessoa.service';
import { ListarPessoaComponent } from './listar-pessoa/listar-pessoa.component';



@NgModule({
  declarations: [
    ListarPessoaComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    PessoaService
  ]
})
export class PessoaModule { }
