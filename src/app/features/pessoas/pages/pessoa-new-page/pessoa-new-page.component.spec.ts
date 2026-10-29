import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { PessoaNewPageComponent } from './pessoa-new-page.component';
import { STORAGE_KEY } from '../../../../core/storage/pessoa-storage';

describe('PessoaNewPageComponent', () => {
  let fixture: ComponentFixture<PessoaNewPageComponent>;
  let navigate: ReturnType<typeof vi.spyOn>;

  const element = (): HTMLElement => fixture.nativeElement;

  function type(id: string, value: string) {
    const input = element().querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function submit() {
    element().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PessoaNewPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(PessoaNewPageComponent);
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should save a valid person and go back to the list', () => {
    type('nome', 'Carla');
    type('dataNascimento', '10101990');
    type('idade', '35');
    submit();

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([
      expect.objectContaining({ nome: 'Carla', idade: 35, dataNascimento: '10101990' }),
    ]);
    expect(navigate).toHaveBeenCalledWith(['/pessoas/listas']);
  });

  it('should stay on the page and save nothing when the form is invalid', () => {
    submit();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should stay on the page and warn when the browser refuses to save', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('cheio', 'QuotaExceededError');
    });

    type('nome', 'Carla');
    type('dataNascimento', '10101990');
    type('idade', '35');
    submit();

    expect(navigate).not.toHaveBeenCalled();
    expect(element().querySelector('[role="alert"]')?.textContent).toContain(
      'Não foi possível salvar',
    );
  });
});
