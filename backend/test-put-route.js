// Script para testar se a rota PUT está funcionando
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';
const TEST_ID = 'afc9808d-01b3-4eb3-8100-6285bb0fc6da'; // ID de teste

// Primeiro, fazer login para obter token
async function testPutRoute() {
  try {
    console.log('=== TESTE DE ROTA PUT ===\n');
    
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
    console.log('✅ Login realizado com sucesso!\n');
    
    // 2. Testar PUT com URL completa
    console.log('2. Testando PUT /api/tratamentos/' + TEST_ID);
    console.log('   URL completa: http://localhost:3000/api/tratamentos/' + TEST_ID);
    
    const putResponse = await fetch(`http://localhost:3000/api/tratamentos/${TEST_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: 'Implantes de Carga Imediata TEST',
        ativo: true
      })
    });
    
    console.log('   Status:', putResponse.status);
    console.log('   Status Text:', putResponse.statusText);
    
    const putData = await putResponse.json();
    console.log('   Resposta:', JSON.stringify(putData, null, 2));
    
    if (putResponse.ok) {
      console.log('\n✅ PUT funcionou corretamente!');
    } else {
      console.log('\n❌ PUT falhou!');
      console.log('   Erro:', putData.error?.message || 'Erro desconhecido');
    }
    
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message);
    console.error(error);
  }
}

testPutRoute();









