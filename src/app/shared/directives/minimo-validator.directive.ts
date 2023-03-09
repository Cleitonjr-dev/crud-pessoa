import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms';
import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[minimoValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: MinimoValidatorDirective,
    multi: true
  }]
})
export class MinimoValidatorDirective implements Validator, OnInit {

  @Input("valorMinimo") valorMinimo: string = "0";

  constructor() { }
  ngOnInit(): void { }

  validate(c: FormControl) {
    let v: number = +c.value;
    if (isNaN(v)) {
      return { 'minimo': true, 'requiredValue': +this.valorMinimo }
    }
    if (v < +this.valorMinimo) {
      return { 'minimo': true, 'requiredValue': +this.valorMinimo }
    }
    return null
  }

}
