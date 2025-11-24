import agendamentosService from '../services/agendamentosService.js';

export async function listAgendamentos(req, res, next) {
  try {
    const result = await agendamentosService.findAll(req.query);
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAgendamentoById(req, res, next) {
  try {
    const agendamento = await agendamentosService.findById(req.params.id);
    res.json({
      success: true,
      data: agendamento,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAgendamento(req, res, next) {
  try {
    const agendamento = await agendamentosService.create(req.body);
    res.status(201).json({
      success: true,
      data: agendamento,
      message: 'Agendamento criado com sucesso. Em breve entraremos em contato!',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAgendamento(req, res, next) {
  try {
    const agendamento = await agendamentosService.update(req.params.id, req.body);
    res.json({
      success: true,
      data: agendamento,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAgendamento(req, res, next) {
  try {
    await agendamentosService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}


