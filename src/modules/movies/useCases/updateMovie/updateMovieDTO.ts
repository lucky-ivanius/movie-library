export interface UpdateMovieDTO {
  id: string;
  data: UpdateMovieProps;
}

export interface UpdateMovieProps {
  name?: string;
  year?: number;
  actors?: UpdateManyProps;
  authors?: UpdateManyProps;
}

export interface UpdateManyProps {
  new?: string[];
  removes?: string[];
}
