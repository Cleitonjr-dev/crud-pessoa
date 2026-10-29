import { TestBed } from '@angular/core/testing';

import { PessoaStorage, STORAGE_KEY, parsePessoa } from './pessoa-storage';

describe('parsePessoa', () => {
  it('should convert the old format (age and date as text)', () => {
    expect(
      parsePessoa({ id: 1700000000000, nome: 'Ana', idade: '25', dataNascimento: '01022000' }),
    ).toEqual({ id: 1700000000000, nome: 'Ana', idade: 25, dataNascimento: '01022000' });
  });

  it('should strip the mask from the date', () => {
    expect(parsePessoa({ id: 1, nome: 'Ana', idade: 20, dataNascimento: '01/02/2000' })).toEqual({
      id: 1,
      nome: 'Ana',
      idade: 20,
      dataNascimento: '01022000',
    });
  });

  it('should reject items without a numeric id or a name', () => {
    expect(parsePessoa(null)).toBeNull();
    expect(parsePessoa('texto')).toBeNull();
    expect(parsePessoa({ nome: 'Ana' })).toBeNull();
    expect(parsePessoa({ id: '1', nome: 'Ana' })).toBeNull();
    expect(parsePessoa({ id: 1 })).toBeNull();
  });
});

describe('PessoaStorage', () => {
  let storage: PessoaStorage;

  beforeEach(() => {
    localStorage.clear();
    storage = TestBed.inject(PessoaStorage);
  });

  it('should return an empty list when nothing was saved', () => {
    expect(storage.read()).toEqual([]);
  });

  it('should write and read back', () => {
    const pessoas = [{ id: 1, nome: 'Ana', idade: 30, dataNascimento: '01012000' }];

    storage.write(pessoas);

    expect(storage.read()).toEqual(pessoas);
  });

  it('should read records saved by the previous version of the app', () => {
    localStorage.setItem(
      STORAGE_KEY,
      '[{"nome":"Bia","dataNascimento":"05051990","idade":"35","id":1678000000000}]',
    );

    expect(storage.read()).toEqual([
      { id: 1678000000000, nome: 'Bia', idade: 35, dataNascimento: '05051990' },
    ]);
  });

  it('should skip invalid items and keep the valid ones', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ lixo: true }, { id: 2, nome: 'Caio' }]));

    expect(storage.read().map((pessoa) => pessoa.id)).toEqual([2]);
  });

  it('should throw when the saved data is corrupted or is not a list', () => {
    localStorage.setItem(STORAGE_KEY, '{quebrado');
    expect(() => storage.read()).toThrow();

    localStorage.setItem(STORAGE_KEY, '{"a":1}');
    expect(() => storage.read()).toThrow();
  });
});
