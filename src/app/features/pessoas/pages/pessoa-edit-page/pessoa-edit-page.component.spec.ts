import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { PessoaEditPageComponent } from './pessoa-edit-page.component';
import { STORAGE_KEY } from '../../../../core/storage/pessoa-storage';

describe('PessoaEditPageComponent', () => {
  let fixture: ComponentFixture<PessoaEditPageComponent>;
  let navigate: ReturnType<typeof vi.spyOn>;

  const element = (): HTMLElement => fixture.nativeElement;
  const field = (id: string) => element().querySelector<HTMLInputElement>(`#${id}`)!;

  async function render(id: string) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 7, nome: 'Dora', idade: '28', dataNascimento: '03031997' }]),
    );
    await TestBed.configureTestingModule({
      imports: [PessoaEditPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(PessoaEditPageComponent);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('should load the person into the form', async () => {
    await render('7');

    expect(field('nome').value).toBe('Dora');
    expect(field('dataNascimento').value).toBe('03/03/1997');
    expect(field('idade').value).toBe('28');
    expect(element().querySelector('button[type="submit"]')?.textContent).toContain('Atualizar');
  });

  it('should update the person and go back to the list', async () => {
    await render('7');

    field('nome').value = 'Dora Maria';
    field('nome').dispatchEvent(new Event('input'));
    element().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([
      { id: 7, nome: 'Dora Maria', idade: 28, dataNascimento: '03031997' },
    ]);
    expect(navigate).toHaveBeenCalledWith(['/pessoas/listas']);
  });

  it('should explain when the person does not exist, with a way back', async () => {
    await render('999');

    expect(element().textContent).toContain('Pessoa não encontrada.');
    expect(element().querySelector('form')).toBeNull();
    expect(element().querySelector('a[href="/pessoas/listas"]')).not.toBeNull();
  });
});
