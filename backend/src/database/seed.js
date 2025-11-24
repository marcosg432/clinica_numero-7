import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import config from '../config/env.js';
import logger from '../config/logger.js';

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Starting seed...');

  // Limpar dados antigos (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    logger.info('Cleaning existing data...');
    await prisma.agendamento.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.tratamento.deleteMany();
    await prisma.usuario.deleteMany();
  }

  // Criar ou atualizar usuário admin
  const senhaHash = await bcrypt.hash(config.admin.password, 12);
  const admin = await prisma.usuario.upsert({
    where: { email: config.admin.email },
    update: {
      senhaHash, // Atualizar senha sempre
      nome: config.admin.name,
      role: 'ADMIN',
      ativo: true,
      failedAttempts: 0,
      lockedUntil: null,
    },
    create: {
      nome: config.admin.name,
      email: config.admin.email,
      senhaHash,
      role: 'ADMIN',
      ativo: true,
    },
  });
  logger.info(`✅ Admin user created: ${admin.email}`);

  // Criar tratamentos
  const tratamentos = [
    {
      nome: 'Lentes de Contato Dental',
      slug: 'lentes-de-contato-dental',
      descricao: 'Lamínas ultrafinas planejadas digitalmente para entregar cor, forma e brilho sob medida.',
      imagem: '/assets/img/tratamentos/lentes-banner.webp',
      ativo: true,
    },
    {
      nome: 'Clareamento a Laser',
      slug: 'clareamento-a-laser',
      descricao: 'Gel exclusivo ativado por luz azul, com monitoramento de sensibilidade em tempo real.',
      imagem: '/assets/img/tratamentos/clareamento-banner.webp',
      ativo: true,
    },
    {
      nome: 'Implantes de Carga Imediata',
      slug: 'implantes-de-carga-imediata',
      descricao: 'Cirurgias guiadas por tomografia e prótese provisória instalada na sequência.',
      imagem: '/assets/img/tratamentos/implantes-banner.webp',
      ativo: true,
    },
    {
      nome: 'Ortodontia Digital',
      slug: 'ortodontia-digital',
      descricao: 'Escaneamento intraoral e acompanhamento remoto para movimentos controlados.',
      imagem: '/assets/img/tratamentos/ortodontia-banner.webp',
      ativo: true,
    },
    {
      nome: 'Harmonização Facial',
      slug: 'harmonizacao-facial',
      descricao: 'Protocolos personalizados para realçar traços e valorizar o sorriso.',
      imagem: '/assets/img/tratamentos/harmonizacao-banner.webp',
      ativo: true,
    },
  ];

  const createdTratamentos = [];
  for (const tratamento of tratamentos) {
    const created = await prisma.tratamento.upsert({
      where: { slug: tratamento.slug },
      update: {},
      create: tratamento,
    });
    createdTratamentos.push(created);
  }
  logger.info(`✅ Created ${createdTratamentos.length} tratamentos`);

  // Criar avaliações
  const avaliacoes = [
    {
      nome: 'Gabriela Lopes',
      avatar: 'GL',
      nota: 5,
      texto: 'Atendimento muito acolhedor. Fiz lentes de contato dental e fiquei impressionada com o planejamento digital e o cuidado no ajuste final.',
      dataAvaliacao: new Date('2025-10-15'),
      aprovado: true,
    },
    {
      nome: 'Rafael Mendes',
      avatar: 'RM',
      nota: 5,
      texto: 'Passei pelo clareamento a laser e o resultado saiu muito acima da expectativa. Zero sensibilidade e equipe super atenciosa.',
      dataAvaliacao: new Date('2025-09-20'),
      aprovado: true,
    },
    {
      nome: 'Viviane Campos',
      avatar: 'VC',
      nota: 5,
      texto: 'Implantes de carga imediata transformaram minha qualidade de vida. Profissionais excelentes e infraestrutura de ponta!',
      dataAvaliacao: new Date('2025-09-10'),
      aprovado: true,
    },
    {
      nome: 'Marcos Silva',
      avatar: 'MS',
      nota: 5,
      texto: 'Ortodontia digital mudou completamente minha experiência. Alinhadores confortáveis e resultado incrível!',
      dataAvaliacao: new Date('2025-08-25'),
      aprovado: true,
    },
    {
      nome: 'Ana Paula',
      avatar: 'AP',
      nota: 5,
      texto: 'Harmonização facial feita com muito cuidado e atenção. Resultado natural e profissionalismo de primeira.',
      dataAvaliacao: new Date('2025-08-15'),
      aprovado: true,
    },
  ];

  for (const avaliacao of avaliacoes) {
    await prisma.avaliacao.create({
      data: avaliacao,
    });
  }
  logger.info(`✅ Created ${avaliacoes.length} avaliações`);

  // Criar agendamentos de teste
  if (createdTratamentos.length > 0) {
    const agendamentos = [
      {
        nome: 'João Santos',
        telefone: '(67) 99999-9999',
        email: 'joao@example.com',
        tratamentoId: createdTratamentos[0].id,
        dataAgendada: new Date('2025-12-01T10:00:00'),
        status: 'PENDENTE',
        notas: 'Primeira consulta',
      },
      {
        nome: 'Maria Oliveira',
        telefone: '(67) 98888-8888',
        email: 'maria@example.com',
        tratamentoId: createdTratamentos[1].id,
        dataAgendada: new Date('2025-12-02T14:00:00'),
        status: 'CONFIRMADO',
        notas: 'Retorno',
      },
    ];

    for (const agendamento of agendamentos) {
      await prisma.agendamento.create({
        data: agendamento,
      });
    }
    logger.info(`✅ Created ${agendamentos.length} agendamentos`);
  }

  logger.info('🎉 Seed completed successfully!');
}

main()
  .catch((error) => {
    logger.error({ error }, 'Seed failed');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

