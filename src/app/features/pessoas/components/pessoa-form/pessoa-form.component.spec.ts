import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PessoaFormComponent } from './pessoa-form.component';
import { PessoaDados } from '../../models/pessoa.model';

describe('PessoaFormComponent', () => {
  let fixture: ComponentFixture<PessoaFormComponent>;
  let emitted: PessoaDados[];

  const element = (): HTMLElement => fixture.nativeElement;
  const field = (id: string) => element().querySelector<HTMLInputElement>(`#${id}`)!;
  const text = () => (element().textContent ?? '').replace(/\s+/g, ' ');

  function type(id: string, value: string) {
    const input = field(id);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  }

  function submit() {
    element().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  async function render(initial: PessoaDados | null = null) {
    await TestBed.configureTestingModule({
      imports: [PessoaFormComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaFormComponent);
    fixture.componentRef.setInput('submitLabel', 'Salvar');
    fixture.componentRef.setInput('initial', initial);
    emitted = [];
    fixture.componentInstance.saved.subscribe((dados) => emitted.push(dados));
    fixture.detectChanges();
  }

  it('should start without error messages', async () => {
    await render();

    expect(element().querySelectorAll('[id$="-erro"]').length).toBe(0);
    expect(element().querySelector('button[type="submit"]')?.textContent).toContain('Salvar');
  });

  it('should show every error and not save when submitted empty', async () => {
    await render();

    submit();

    expect(text()).toContain('Digite o nome da pessoa.');
    expect(text()).toContain('Digite a data de nascimento da pessoa.');
    expect(text()).toContain('Digite a idade da pessoa.');
    expect(field('nome').getAttribute('aria-invalid')).toBe('true');
    expect(field('nome').getAttribute('aria-describedby')).toBe('nome-erro');
    expect(emitted).toEqual([]);
  });

  it('should require at least 2 characters in the name', async () => {
    await render();

    type('nome', 'A');
    expect(text()).toContain('O nome deve conter ao menos 2 caracteres.');

    type('nome', '  A ');
    expect(text()).toContain('O nome deve conter ao menos 2 caracteres.');

    type('nome', 'Al');
    expect(text()).not.toContain('O nome deve conter');
  });

  it('should reject people under 18 and non-integer ages', async () => {
    await render();

    type('idade', '17');
    expect(text()).toContain('Idade deve ser maior ou igual a 18 anos.');

    type('idade', '18.5');
    expect(text()).toContain('Digite a idade em anos inteiros.');

    type('idade', '18');
    expect(text()).not.toContain('Idade deve');
  });

  it('should mask the birth date while typing and drop extra digits', async () => {
    await render();

    type('dataNascimento', '01022000');
    expect(field('dataNascimento').value).toBe('01/02/2000');

    type('dataNascimento', '010220001');
    expect(field('dataNascimento').value).toBe('01/02/2000');
  });

  it('should reject a date that does not exist or is in the future', async () => {
    await render();

    type('dataNascimento', '31022000');
    expect(text()).toContain('Digite uma data válida');

    type('dataNascimento', '01012999');
    expect(text()).toContain('Digite uma data válida');

    type('dataNascimento', '01012000');
    expect(text()).not.toContain('Digite uma data válida');
  });

  it('should emit trimmed name, date digits and numeric age when valid', async () => {
    await render();

    type('nome', '  Ana Paula ');
    type('dataNascimento', '29022000');
    type('idade', '26');
    submit();

    expect(emitted).toEqual([{ nome: 'Ana Paula', idade: 26, dataNascimento: '29022000' }]);
  });

  it('should fill the fields when editing', async () => {
    await render({ nome: 'Bia', idade: 35, dataNascimento: '05051990' });

    expect(field('nome').value).toBe('Bia');
    expect(field('dataNascimento').value).toBe('05/05/1990');
    expect(field('idade').value).toBe('35');

    submit();

    expect(emitted).toEqual([{ nome: 'Bia', idade: 35, dataNascimento: '05051990' }]);
  });
});
