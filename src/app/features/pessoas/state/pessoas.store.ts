import { Injectable, inject, signal } from '@angular/core';

import { PessoaStorage } from '../../../core/storage/pessoa-storage';
import { Pessoa, PessoaDados } from '../models/pessoa.model';

const READ_ERROR = 'Não foi possível ler os dados salvos neste navegador.';
const WRITE_ERROR =
  'Não foi possível salvar neste navegador. Verifique se o armazenamento está liberado.';

@Injectable({ providedIn: 'root' })
export class PessoasStore {
  private readonly storage = inject(PessoaStorage);

  private readonly _pessoas = signal<Pessoa[]>([]);
  private readonly _error = signal<string | null>(null);

  public readonly pessoas = this._pessoas.asReadonly();
  /** Mensagem amigável da última falha de leitura ou gravação. */
  public readonly error = this._error.asReadonly();

  constructor() {
    try {
      this._pessoas.set(this.storage.read());
    } catch (error) {
      console.error(error);
      this._error.set(READ_ERROR);
    }
  }

  public getById(id: number): Pessoa | undefined {
    return this._pessoas().find((pessoa) => pessoa.id === id);
  }

  public add(dados: PessoaDados): boolean {
    const pessoas = this._pessoas();
    // timestamp como antes, mas nunca repete um id já existente
    const id = Math.max(Date.now(), ...pessoas.map((pessoa) => pessoa.id + 1));

    return this.save([...pessoas, { id, ...dados }]);
  }

  public update(id: number, dados: PessoaDados): boolean {
    return this.save(
      this._pessoas().map((pessoa) => (pessoa.id === id ? { id, ...dados } : pessoa)),
    );
  }

  public remove(id: number): boolean {
    return this.save(this._pessoas().filter((pessoa) => pessoa.id !== id));
  }

  public clearError(): void {
    this._error.set(null);
  }

  private save(pessoas: Pessoa[]): boolean {
    try {
      this.storage.write(pessoas);
    } catch (error) {
      console.error(error);
      this._error.set(WRITE_ERROR);

      return false;
    }

    this._pessoas.set(pessoas);
    this._error.set(null);

    return true;
  }
}
