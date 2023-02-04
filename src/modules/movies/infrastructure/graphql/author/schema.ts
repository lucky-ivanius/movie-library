import { createAuthor, updateAuthor, deleteAuthor } from './mutations';
import { findAuthorById, findAuthors } from './queries';

export const authorQueries = {
  author: findAuthorById,
  authors: findAuthors
};

export const authorMutations = {
  createAuthor,
  updateAuthor,
  deleteAuthor
};
