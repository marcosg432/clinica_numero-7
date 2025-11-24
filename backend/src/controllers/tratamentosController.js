import tratamentosService from '../services/tratamentosService.js';

export async function listTratamentos(req, res, next) {
  try {
    const result = await tratamentosService.findAll(req.query);
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTratamentoBySlug(req, res, next) {
  try {
    const tratamento = await tratamentosService.findBySlug(req.params.slug);
    res.json({
      success: true,
      data: tratamento,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTratamentoById(req, res, next) {
  try {
    const tratamento = await tratamentosService.findById(req.params.id);
    res.json({
      success: true,
      data: tratamento,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTratamento(req, res, next) {
  try {
    const tratamento = await tratamentosService.create(req.body);
    res.status(201).json({
      success: true,
      data: tratamento,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTratamento(req, res, next) {
  try {
    console.log('=== CONTROLLER updateTratamento ===');
    console.log('req.params:', req.params);
    console.log('req.params.id:', req.params.id);
    console.log('req.body:', req.body);
    console.log('Tipo do ID:', typeof req.params.id);
    console.log('ID é undefined?', req.params.id === undefined);
    console.log('ID é null?', req.params.id === null);
    console.log('ID é string vazia?', req.params.id === '');
    console.log('===============================');
    
    const tratamento = await tratamentosService.update(req.params.id, req.body);
    res.json({
      success: true,
      data: tratamento,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTratamento(req, res, next) {
  try {
    await tratamentosService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}


