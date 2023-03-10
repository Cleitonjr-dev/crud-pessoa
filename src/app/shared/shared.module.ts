import { NgModule } from '@angular/core';

// Diretivas
import { NumericoDirective, MinimoValidatorDirective } from './directives';
//Pipes
import { MeuPipePipe } from './pipes';


@NgModule({
  declarations: [
    MinimoValidatorDirective,
    NumericoDirective,
    MeuPipePipe

  ],
  exports: [
    MinimoValidatorDirective,
    NumericoDirective,
    MeuPipePipe
    
  ]
})
export class SharedModule { }
