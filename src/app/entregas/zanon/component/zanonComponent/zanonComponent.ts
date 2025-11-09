import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ZanonService } from '../zanonService/zanon-service';
import { Pokemon } from '../zanonModel/zanonInterface';
import { MatDialog } from '@angular/material/dialog';
import { DatosUnroutedComponent } from '../datosUnroutedComponent/datos-unrouted-component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-zanon',
  imports: [CommonModule, MatPaginatorModule, FormsModule],
  templateUrl: './zanonComponent.html',
  styleUrl: './zanonComponent.css',
})
export class ZanonComponent {

  pokemons: Pokemon[] = [];

  paginasPokemon: Pokemon[] = [];

  pageSize = 4;
  pageIndex = 0;
  length = 0;

  filtroNombre: string = '';

  pokemonsFiltrados: Pokemon[] = [];

  // Se crea una referencia directa en el Typescript al componente "<mat-paginator>" del HTML
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  oMatDialog = inject(MatDialog);

  constructor(private oZanonService: ZanonService) {

  }

  ngOnInit() {
    this.getPokemon();
  }

  getPokemon() {
    this.oZanonService.getAll().subscribe({
      next: (pokemonsCargados: Pokemon[]) => {
        console.log("Pokémons cargados con éxito: ", pokemonsCargados);
        this.pokemons = pokemonsCargados;

        this.pokemonsFiltrados = [...this.pokemons];

        this.length = this.pokemonsFiltrados.length;
        this.actualizarPagina();
      },
      error: err => console.log("Error al cargar los Pokémons: ", err)
    });
  }

  verInformacionPokemon(pokemon: Pokemon) {
    console.log("Datos cargados de un Pokemon: ", pokemon);

    this.oMatDialog.open(DatosUnroutedComponent, {
      height: '400px',
      width: '600px',
      data: {
        oPokemon: pokemon,
      }
    });
  }

  // Se ejecuta cada ver que el usuario escribe algo en el buscador
  filtroPokemon() {

    // Convierte todo el texto que el usuario escribe en el "input" a minúsculas, eliminándo además espacios al principio y al final
    const filtro = this.filtroNombre.trim().toLowerCase();

    this.pokemonsFiltrados = filtro === ''
      ? [...this.pokemons] // Si el filtro está vacío, se copian todos los Pokémon a "pokemonFiltrados"
      : this.pokemons.filter(p => p.name.toLowerCase().includes(filtro)); // Si el filtro no está vacío, se usa "filter()" para
                                                                          // crear un nuevo array con los Pokémon cuyo nombre
                                                                          // contiene la cadena escrita por el usuario

                                                                          // "toLowerCase()" se aplica al nombre para mantener
                                                                          // la búsqueda insensible a mayúsculas/minúsculas

    this.length = this.pokemonsFiltrados.length;
    this.pageIndex = 0;
    this.actualizarPagina();
  }

  actualizarPagina() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // "slice()" crea un subarray con solo los Pokemon que se han seleccionado
    this.paginasPokemon = this.pokemonsFiltrados.slice(startIndex, endIndex);
  }

  // Se ejecuta cada vez que el usuario cambia la página en el "paginator"
  cambioPagina(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarPagina();
  }
}