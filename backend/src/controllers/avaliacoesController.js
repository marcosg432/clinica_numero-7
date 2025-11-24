import avaliacoesService from '../services/avaliacoesService.js';

export async function listAvaliacoes(req, res, next) {
  try {
    // Para frontend público, só mostrar aprovadas
    const filters = { ...req.query };
    if (!req.user || req.user.role !== 'ADMIN') {
      filters.aprovado = true;
    }

    const result = await avaliacoesService.findAll(filters);
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAvaliacaoById(req, res, next) {
  try {
    const avaliacao = await avaliacoesService.findById(req.params.id);
    res.json({
      success: true,
      data: avaliacao,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAvaliacao(req, res, next) {
  try {
    const avaliacao = await avaliacoesService.create(req.body);
    res.status(201).json({
      success: true,
      data: avaliacao,
      message: 'Avaliação enviada com sucesso! Será revisada antes de ser publicada.',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAvaliacao(req, res, next) {
  try {
    const avaliacao = await avaliacoesService.update(req.params.id, req.body);
    res.json({
      success: true,
      data: avaliacao,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAvaliacao(req, res, next) {
  try {
    await avaliacoesService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}


