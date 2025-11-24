// Script para testar a rota PUT diretamente e ver o erro
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

async function testar() {
  try {
    console.log('=== TESTE DE PUT /tratamentos/:id ===\n');
    
    // 1. Login
    console.log('1. Fazendo login...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@clinica.com',
        password: 'Admin123!@'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error('❌ Erro no login:', loginData);
      return;
    }
    
    const token = loginData.data.accessToken;
    console.log('✅ Login OK!\n');
    
    // 2. Listar tratamentos para pegar um ID
    console.log('2. Listando tratamentos para pegar um ID...');
    const listResponse = await fetch(`${API_URL}/tratamentos?limit=5`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const listData = await listResponse.json();
    
    if (!listResponse.ok || !listData.data || listData.data.length === 0) {
      console.error('❌ Erro ao listar tratamentos:', listData);
      return;
    }
    
    const tratamentoId = listData.data[0].id;
    console.log(`✅ ID do tratamento: ${tratamentoId}\n`);
    
    // 3. Testar PUT
    console.log('3. Testando PUT /tratamentos/' + tratamentoId);
    console.log(`   URL: ${API_URL}/tratamentos/${tratamentoId}`);
    console.log(`   Method: PUT`);
    console.log(`   Token presente: ${!!token}\n`);
    
    const putResponse = await fetch(`${API_URL}/tratamentos/${tratamentoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: listData.data[0].nome + ' (Teste)',
        ativo: true
      })
    });
    
    console.log(`   Status: ${putResponse.status}`);
    console.log(`   Status Text: ${putResponse.statusText}\n`);
    
    const putData = await putResponse.json();
    console.log('   Resposta completa:');
    console.log(JSON.stringify(putData, null, 2));
    
    if (putResponse.ok) {
      console.log('\n✅ PUT funcionou!');
    } else {
      console.log('\n❌ PUT falhou!');
      console.log(`   Erro: ${putData.error?.message || 'Erro desconhecido'}`);
    }
    
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message);
    console.error(error);
  }
}

testar();










