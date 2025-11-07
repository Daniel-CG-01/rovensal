export interface Libro {
    Year: number;
    Title: string;
    Publisher: string;
    ISBN: string;
    Pages: number;
    coverUrl?: string;
    description?: string;
}