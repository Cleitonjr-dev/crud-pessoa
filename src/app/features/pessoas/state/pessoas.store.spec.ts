import { TestBed } from '@angular/core/testing';

import { PessoasStore } from './pessoas.store';
import { STORAGE_KEY } from '../../../core/storage/pessoa-storage';

const ana = { nome: 'Ana', idade: 30, dataNascimento: '01012000' };
const bia = { nome: 'Bia', idade: 40, dataNascimento: '02021990' };

function createStore(): PessoasStore {
  TestBed.resetTestingModule();

  return TestBed.inject(PessoasStore);
}

describe('PessoasStore', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('should start empty', () => {
    const store = createStore();

    expect(store.pessoas()).toEqual([]);
    expect(store.error()).toBeNull();
  });

  it('should add people with unique ids and persist them', () => {
    const store = createStore();

    expect(store.add(ana)).toBe(true);
    expect(store.add(bia)).toBe(true);

    const [first, second] = store.pessoas();
    expect(first.id).not.toBe(second.id);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toHaveLength(2);
    expect(
      createStore()
        .pessoas()
        .map((pessoa) => pessoa.nome),
    ).toEqual(['Ana', 'Bia']);
  });

  it('should find, update and remove a person', () => {
    const store = createStore();
    store.add(ana);
    store.add(bia);
    const id = store.pessoas()[0].id;

    expect(store.getById(id)?.nome).toBe('Ana');

    store.update(id, { ...ana, nome: 'Ana Paula' });
    expect(store.getById(id)?.nome).toBe('Ana Paula');
    expect(store.pessoas()).toHaveLength(2);

    store.remove(id);
    expect(store.getById(id)).toBeUndefined();
    expect(store.pessoas().map((pessoa) => pessoa.nome)).toEqual(['Bia']);
  });

  it('should keep the old records and let new ones be added next to them', () => {
    localStorage.setItem(
      STORAGE_KEY,
      '[{"nome":"Velha","dataNascimento":"05051990","idade":"35","id":1678000000000}]',
    );
    const store = createStore();

    expect(store.pessoas()[0]).toEqual({
      id: 1678000000000,
      nome: 'Velha',
      idade: 35,
      dataNascimento: '05051990',
    });

    store.add(ana);
    expect(store.pessoas()).toHaveLength(2);
  });

  it('should show a friendly error and keep the list when saving fails', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const store = createStore();
    store.add(ana);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('cheio', 'QuotaExceededError');
    });

    expect(store.add(bia)).toBe(false);
    expect(store.pessoas()).toHaveLength(1);
    expect(store.error()).toContain('Não foi possível salvar');

    vi.restoreAllMocks();
    expect(store.add(bia)).toBe(true);
    expect(store.error()).toBeNull();
  });

  it('should report an error when the saved data is corrupted', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    localStorage.setItem(STORAGE_KEY, '{quebrado');
    const store = createStore();

    expect(store.pessoas()).toEqual([]);
    expect(store.error()).toContain('Não foi possível ler');
  });
});
