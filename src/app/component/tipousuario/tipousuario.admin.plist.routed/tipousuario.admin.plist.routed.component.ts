import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { ITipousuario } from '../../../model/tipousuario.interface';
import { tipousuarioService } from '../../../service/tipousuario.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-tipousuario-admin-routed',
  templateUrl: './tipousuario.admin.plist.routed.component.html',
  styleUrls: ['./tipousuario.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})

export class TipousuarioAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<ITipousuario> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = 'desc';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
  private debounceSubject = new Subject<string>();
  oTipousuario: ITipousuario = {} as ITipousuario;
  numeroSubcuentas: number = 0;
  id: number = 0;
  titulo: string = '';
  arrNumSubcuentas: Number[] = [];

  constructor(
    private otipousuarioService: tipousuarioService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
  }

  ngOnInit() {
    this.getPage();
  }

  getOne() {
    this.otipousuarioService.getOne(this.id).subscribe({
      next: (data: ITipousuario) => {
        this.oTipousuario = data;

      },
    });
  }

  getPage() {
    this.otipousuarioService
      .getPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
      )
      .subscribe({
        next: (oPageFromServer: IPage<ITipousuario>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );

        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  edit(oTipousuario: ITipousuario) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/tipousuario/edit', oTipousuario.id]);
  }

  view(oTipousuario: ITipousuario) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/tipousuario/view', oTipousuario.id]);
  }

  remove(oTipousuario: ITipousuario) {
    this.oRouter.navigate(['admin/tipousuario/delete/', oTipousuario.id]);
  }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }

  sort(field: string) {
    this.strField = field;
    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  goToRpp(nrpp: number) {
    this.nPage = 0;
    this.nRpp = nrpp;
    this.getPage();
    return false;
  }

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
  }

  getPageSubcuenta(id: number) {
    this.otipousuarioService.getPageSubcuenta(id).subscribe({
      next: (data: number) => {
        this.numeroSubcuentas = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });
  }

}
