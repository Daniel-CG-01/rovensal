import { Component, inject } from '@angular/core';
import { Libro } from '../zanonModel/zanonInterface';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-datos-unrouted-component',
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './datos-unrouted-component.html',
  styleUrl: './datos-unrouted-component.css',
  standalone: true,
})
export class DatosUnroutedComponent {

  data = inject(MAT_DIALOG_DATA);

  oLibro: Libro = {} as Libro;

  ngOnInit() {
    console.log("Datos recibidos en el diálogo: ", this.data);
    this.oLibro = this.data.oLibro;
  }
}