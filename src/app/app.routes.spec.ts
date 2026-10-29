import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';

import { routes } from './app.routes';

describe('routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
    harness = await RouterTestingHarness.create();
  });

  it('should send the root and /pessoas to the list', async () => {
    await harness.navigateByUrl('/');
    expect(TestBed.inject(Router).url).toBe('/pessoas/listas');

    await harness.navigateByUrl('/pessoas');
    expect(TestBed.inject(Router).url).toBe('/pessoas/listas');
  });

  it('should open the list, the new form and the edit form with their titles', async () => {
    await harness.navigateByUrl('/pessoas/listas');
    expect(TestBed.inject(Title).getTitle()).toBe('Pessoas · Cadastro de Pessoas');

    await harness.navigateByUrl('/pessoas/novo');
    expect(TestBed.inject(Title).getTitle()).toBe('Nova pessoa · Cadastro de Pessoas');

    await harness.navigateByUrl('/pessoas/editar/123');
    expect(TestBed.inject(Title).getTitle()).toBe('Editar pessoa · Cadastro de Pessoas');
    expect(harness.routeNativeElement?.textContent).toContain('Pessoa não encontrada.');
  });

  it('should show the not found page for an unknown address', async () => {
    await harness.navigateByUrl('/qualquer/coisa');

    expect(harness.routeNativeElement?.textContent).toContain('Página não encontrada');
    expect(TestBed.inject(Title).getTitle()).toBe('Página não encontrada · Cadastro de Pessoas');
  });
});
