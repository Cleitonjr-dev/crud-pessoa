import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PessoaListPageComponent } from './pessoa-list-page.component';
import { STORAGE_KEY } from '../../../../core/storage/pessoa-storage';
import { stubDialog } from '../../../../core/testing/dialog-stub';

const pessoas = [
  { id: 1, nome: 'Ana', idade: 30, dataNascimento: '01012000' },
  { id: 2, nome: 'Bia', idade: 40, dataNascimento: '02021990' },
];

describe('PessoaListPageComponent', () => {
  let fixture: ComponentFixture<PessoaListPageComponent>;

  const element = (): HTMLElement => fixture.nativeElement;
  const text = () => (element().textContent ?? '').replace(/\s+/g, ' ');
  const cards = () => element().querySelectorAll('ul > li');
  const button = (label: string) =>
    element().querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
  const dialogButton = (label: string) =>
    Array.from(element().querySelectorAll<HTMLButtonElement>('dialog button')).find(
      (item) => item.textContent?.trim() === label,
    )!;

  async function render(saved: unknown = pessoas) {
    if (saved !== null) {
      localStorage.setItem(STORAGE_KEY, typeof saved === 'string' ? saved : JSON.stringify(saved));
    }

    await TestBed.configureTestingModule({
      imports: [PessoaListPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaListPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(() => {
    localStorage.clear();
    stubDialog();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should say when nobody is registered', async () => {
    await render(null);

    expect(text()).toContain('Nenhuma pessoa cadastrada.');
    expect(cards().length).toBe(0);
  });

  it('should list the people with formatted birth date and links to edit', async () => {
    await render();

    expect(cards().length).toBe(2);
    expect(text()).toContain('Ana');
    expect(text()).toContain('Idade: 30');
    expect(text()).toContain('Nascimento: 01/01/2000');
    expect(element().querySelector('a[aria-label="Editar Ana"]')?.getAttribute('href')).toBe(
      '/pessoas/editar/1',
    );
    expect(element().querySelector('a[href="/pessoas/novo"]')).not.toBeNull();
  });

  it('should show the details of a person in a dialog and close it', async () => {
    await render();

    button('Ver Bia').click();
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = element().querySelector('dialog')!;
    expect(dialog.textContent).toContain('Bia');
    expect(dialog.textContent).toContain('40');
    expect(dialog.textContent).toContain('02/02/1990');

    dialogButton('Fechar').click();
    fixture.detectChanges();

    expect(element().querySelector('dialog')).toBeNull();
  });

  it('should keep the person when the removal is cancelled', async () => {
    await render();

    button('Remover Ana').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(element().querySelector('dialog')?.textContent).toContain(
      'Deseja realmente remover a pessoa Ana?',
    );

    dialogButton('Cancelar').click();
    fixture.detectChanges();

    expect(cards().length).toBe(2);
    expect(element().querySelector('dialog')).toBeNull();
  });

  it('should remove the person after confirming', async () => {
    await render();

    button('Remover Ana').click();
    fixture.detectChanges();
    await fixture.whenStable();
    dialogButton('Remover').click();
    fixture.detectChanges();

    expect(cards().length).toBe(1);
    expect(text()).not.toContain('Ana');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toHaveLength(1);
  });

  it('should warn the user when the saved data cannot be read', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await render('{quebrado');

    expect(element().querySelector('[role="alert"]')?.textContent).toContain(
      'Não foi possível ler os dados salvos',
    );
    expect(text()).toContain('Nenhuma pessoa cadastrada.');
  });
});
