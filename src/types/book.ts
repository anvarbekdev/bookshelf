export interface Book {
  id: number;
  isbn: string;
  title: string;
  cover: string;
  author: string;
  published: number;
  pages: number;
}

export interface BookResponse {
  book: Book;
  status: number;
}

export type BooksResponse = BookResponse[];


export interface ApiResponse {
  data: {
    book: Book[];
    status: number;
  };
  isOk: boolean;
  message: string;
}
