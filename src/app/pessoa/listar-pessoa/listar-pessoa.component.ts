import { Component, OnInit } from '@angular/core';

import { PessoaService } from '../services/pessoa.service';
import { Pessoa } from 'src/app/shared/models/pessoa.model';

@Component({
  selector: 'app-listar-pessoa',
  templateUrl: './listar-pessoa.component.html',
  styleUrls: ['./listar-pessoa.component.css']
})
export class ListarPessoaComponent implements OnInit {

  pessoas: Pessoa[] = [];

  constructor(private pessoaService : PessoaService) {}

  ngOnInit(): void {
    this.pessoas = this.listarTodos();
  }

  listarTodos(): Pessoa[] {
    return this.pessoaService.listarTodos();

    /*return [
      new Pessoa(1, "Cleiton", 27),
      new Pessoa(2, "Yanna", 23),
      new Pessoa(3, "Maria", 22),
      new Pessoa(4, "Carlos", 26),
    ];*/
  }

}
// Angular - 11.07 - Implementar o Componente de Inserção(video do inivio)
