export interface CreateMovieDTO {
  data: CreateMovieProps;
}

export interface CreateMovieProps {
  name: string;
  year: number;
  actors?: string[];
  authors?: string[];
}
