import { Component, OnInit, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { IDADE_MINIMA, PessoaDados } from '../../models/pessoa.model';
import { isValidBirthDate, maskDate, onlyDigits } from '../../utils/data-nascimento';

type CampoComErro = 'nome' | 'dataNascimento' | 'idade';

/** Pelo menos dois caracteres que não sejam espaço (espaços nas pontas não contam). */
const NOME_PATTERN = /^\s*\S.*\S\s*$/;

function birthDateValidator(control: AbstractControl): ValidationErrors | null {
  const digits = onlyDigits(String(control.value ?? ''));

  return !digits || isValidBirthDate(digits) ? null : { birthDate: true };
}

function integerValidator(control: AbstractControl): ValidationErrors | null {
  return control.value === null || Number.isInteger(control.value) ? null : { integer: true };
}

const MENSAGENS: Record<CampoComErro, Record<string, string>> = {
  nome: {
    required: 'Digite o nome da pessoa.',
    pattern: 'O nome deve conter ao menos 2 caracteres.',
  },
  dataNascimento: {
    required: 'Digite a data de nascimento da pessoa.',
    birthDate: 'Digite uma data válida (dd/mm/aaaa) que não seja futura.',
  },
  idade: {
    required: 'Digite a idade da pessoa.',
    min: `Idade deve ser maior ou igual a ${IDADE_MINIMA} anos.`,
    integer: 'Digite a idade em anos inteiros.',
  },
};

@Component({
  selector: 'app-pessoa-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './pessoa-form.component.html',
})
export class PessoaFormComponent implements OnInit {
  public readonly initial = input<PessoaDados | null>(null);
  public readonly submitLabel = input.required<string>();
  public readonly saved = output<PessoaDados>();

  protected readonly idadeMinima = IDADE_MINIMA;

  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly form = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.pattern(NOME_PATTERN)]],
    dataNascimento: ['', [Validators.required, birthDateValidator]],
    idade: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(IDADE_MINIMA),
      integerValidator,
    ]),
  });

  public ngOnInit(): void {
    const initial = this.initial();

    if (initial) {
      this.form.setValue({
        nome: initial.nome,
        dataNascimento: maskDate(initial.dataNascimento),
        idade: initial.idade,
      });
    }
  }

  protected maskBirthDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    const masked = maskDate(input.value);

    input.value = masked;
    this.form.controls.dataNascimento.setValue(masked);
  }

  /** Mensagem do primeiro erro do campo, mostrada só depois que a pessoa mexeu nele. */
  protected errorOf(field: CampoComErro): string | null {
    const control = this.form.controls[field];

    if (!control.errors || !(control.dirty || control.touched)) {
      return null;
    }

    const key = Object.keys(control.errors)[0];

    return MENSAGENS[field][key] ?? 'Valor inválido.';
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, dataNascimento, idade } = this.form.getRawValue();

    this.saved.emit({
      nome: nome.trim(),
      idade: Number(idade),
      dataNascimento: onlyDigits(dataNascimento),
    });
  }
}
