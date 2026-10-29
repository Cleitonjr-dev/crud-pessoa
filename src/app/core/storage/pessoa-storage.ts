import { Injectable } from '@angular/core';

import { Pessoa } from '../../features/pessoas/models/pessoa.model';

export const STORAGE_KEY = 'pessoas';

/** Aceita o formato antigo (idade e data como texto) e devolve null para itens sem id ou nome. */
export function parsePessoa(item: unknown): Pessoa | null {
  if (typeof item !== 'object' || item === null) {
    return null;
  }

  const { id, nome, idade, dataNascimento } = item as Record<string, unknown>;

  if (typeof id !== 'number' || !Number.isFinite(id) || typeof nome !== 'string') {
    return null;
  }

  return {
    id,
    nome,
    idade: Number(idade),
    dataNascimento: String(dataNascimento ?? '').replace(/\D/g, ''),
  };
}

@Injectable({ providedIn: 'root' })
export class PessoaStorage {
  /** Lança erro se os dados salvos não forem uma lista válida ou o navegador negar o acesso. */
  public read(): Pessoa[] {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error('Os dados salvos não são uma lista.');
    }

    return parsed.flatMap((item) => parsePessoa(item) ?? []);
  }

  /** Lança erro se o navegador negar a escrita (modo privado, cota cheia). */
  public write(pessoas: Pessoa[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pessoas));
  }
}
