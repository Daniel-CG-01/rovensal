import { Component, inject } from '@angular/core';
import { ZanonService } from '../zanonService/zanon-service';
import { Libro } from '../zanonModel/zanonInterface';
import { MatDialog } from '@angular/material/dialog';
import { DatosUnroutedComponent } from '../datosUnroutedComponent/datos-unrouted-component';
import { OpenLibraryService } from '../zanonService/open-library-service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-zanon',
  imports: [],
  templateUrl: './zanonComponent.html',
  styleUrl: './zanonComponent.css',
  standalone: true
})
export class ZanonComponent {

  libros: Libro[] = [];

  oMatDialog = inject(MatDialog);

  constructor(private oZanonService: ZanonService, private oOpenLibraryService: OpenLibraryService) {

  }

  ngOnInit() {
    this.getLibro();
  }

  getLibro() {
    this.oZanonService.getAll().pipe (
      switchMap((libros: Libro[]) => {
        const peticiones = libros.map(libro =>

          // NORMALIZAR LOS ISBNs
          // const nuevoISBN = libro.ISBN.replace(/[^0-9X]/gi, '');

          this.oOpenLibraryService.obtenerInfoLibro(libro.ISBN).pipe (
            map(info => ({
              ...libro, // Conserva los datos del libro original
              coverUrl: info.coverUrl, // Añade la portada
              description: info.description // Añade la descripción
            })),

            // "catchError()" garantiza que cada llamada individual a OpenLibraryService nunca lanze un error fatal.
            // En su lugar, devuelve un valor por defecto
            catchError(() => of({
              ...libro, // Conserva también aquí los datos del libro original
              coverUrl: 'zanon/placeholder-cover.png',
              description: 'Descripción no disponible'
            }))
          )
        );

        // "forkJoin()" combina todos los observables y emite un único array con todos los resultados
        return forkJoin(peticiones);
      })
    ).subscribe({
      next: (librosCargados: Libro[]) => {
        console.log("¡Libros cargados con éxito! ", librosCargados);
        this.libros = librosCargados;
      },
      error: err => console.error("Error al cargar los libros: ", err)
    });
  }

  verInformacionLibro(libro: Libro) {
    console.log("Datos cargador de un libro: ", libro);

    this.oMatDialog.open(DatosUnroutedComponent, {
      height: '400px',
      width: '600px',
      data: {
        oLibro: libro,
      }
    });
  }
}