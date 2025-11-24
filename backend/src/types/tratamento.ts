export interface CreateTratamentoDto {
  nome: string;
  descricao?: string;
  slug: string;
  imagem?: string;
  ativo?: boolean;
}

export interface UpdateTratamentoDto {
  nome?: string;
  descricao?: string;
  slug?: string;
  imagem?: string;
  ativo?: boolean;
}

