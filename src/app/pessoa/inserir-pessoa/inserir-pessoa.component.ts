import { Component, OnInit, ViewChild } from '@angular/core';
import { PessoaService } from '../services/pessoa.service';
import { Pessoa } from 'src/app/shared';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inserir-pessoa',
  templateUrl: './inserir-pessoa.component.html',
  styleUrls: ['./inserir-pessoa.component.css']
})
export class InserirPessoaComponent implements OnInit {
  @ViewChild('formPessoa') formPessoa! : NgForm;
  pessoa! : Pessoa;

  constructor(
    private PessoaService: PessoaService,
    private router: Router) {}

  ngOnInit(): void {
    this.pessoa = new Pessoa();
  }

  inserir(): void {
    if (this.formPessoa.form.valid) {
      this.PessoaService.inserir(this.pessoa);
      this.router.navigate( ["/pessoas"] );
    }
  }

}
