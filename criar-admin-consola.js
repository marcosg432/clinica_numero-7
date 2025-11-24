// Cole este código no Console do navegador (F12) para criar o admin

fetch('https://clinicanumero-7-production.up.railway.app/api/setup/admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Setup-Secret': 'temporary-setup-key-change-in-production'
  }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Resposta completa:', data);
  if (data.success) {
    console.log('✅ Admin criado/atualizado com sucesso!');
    console.log('   Email:', data.data.email);
    console.log('   Nome:', data.data.name);
    console.log('   Ação:', data.data.action);
    alert('✅ Admin criado com sucesso!\n\nEmail: ' + data.data.email + '\nSenha: Verifique no Railway (variável ADMIN_PASSWORD)');
  } else {
    console.error('❌ Erro:', data.error);
    alert('❌ Erro: ' + (data.error?.message || 'Erro desconhecido'));
  }
})
.catch(err => {
  console.error('❌ Erro na requisição:', err);
  alert('❌ Erro ao criar admin. Veja o console para detalhes.');
});



