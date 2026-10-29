export const IDADE_MINIMA = 18;

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
  /** Somente os dígitos, no formato DDMMAAAA (como o app sempre guardou). */
  dataNascimento: string;
}

export type PessoaDados = Omit<Pessoa, 'id'>;
