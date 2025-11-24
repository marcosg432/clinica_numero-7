export interface CreateAgendamentoDto {
  nome: string;
  telefone: string;
  email: string;
  tratamentoId?: string | null;
  dataAgendada?: string | null;
  notas?: string;
  recaptchaToken?: string;
}

export interface UpdateAgendamentoDto {
  status?: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO';
  dataAgendada?: string | null;
  notas?: string;
}

