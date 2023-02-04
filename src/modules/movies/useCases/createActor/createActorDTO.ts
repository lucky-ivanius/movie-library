export interface CreateActorDTO {
  data: CreateActorProps;
}

export interface CreateActorProps {
  fullName: string;
}

export const defaultDTO: CreateActorDTO = {
  data: { fullName: '' }
};
