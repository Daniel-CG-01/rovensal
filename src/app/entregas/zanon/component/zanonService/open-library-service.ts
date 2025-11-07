import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenLibraryService {

  constructor(private oHttpClient: HttpClient) {

  }

  // "isbn: string" es el parámetro que recibe, el identificador del libro. Esto devuelve un "Observable" que emitirá un
  // objeto en dos campos (coverUrl y description)
  obtenerInfoLibro(isbn: string): Observable<{ coverUrl: string, description: string}> {

    // "this.oHttpClient.get<any>" usa el servicio de Angular HttpClient para hacer una petición GET a la API de Open Library
    return this.oHttpClient.get<any>(`https://openlibrary.org/isbn/${isbn}.json`).pipe ( // "pipe" procesa los datos con operadores
      
      // "map" recibe el JSON y devuelve un nuevo objeto con las propiedades que nos interesan
      map(data => ({
        coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
        description: typeof data.description === 'string'
          ? data.description // Si la descripción es un texto, la devuelve tal cual
          : data.description?.value || 'Descripción no disponible' // Si es un objeto, o no existe, busca ".value", o muestra un mensaje por defecto
      })),

      // Por último, "catchError()" maneja los errores.
      // Si hubiera algún fallo, el flujo del "Observable" no se rompería, sino que devolvería un objeto por defecto
      catchError(() => of({ coverUrl: 'zanon/placeholder-cover.png', description: 'Descripción no disponible' }))
    );
  }
}