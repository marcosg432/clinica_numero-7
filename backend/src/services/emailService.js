import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import config from '../config/env.js';
import logger from '../config/logger.js';

class EmailService {
  constructor() {
    if (config.email.provider === 'sendgrid' && config.email.sendgridApiKey) {
      sgMail.setApiKey(config.email.sendgridApiKey);
      this.provider = 'sendgrid';
    } else if (config.email.smtp.host) {
      this.transporter = nodemailer.createTransport({
        host: config.email.smtp.host,
        port: config.email.smtp.port,
        secure: config.email.smtp.secure,
        auth: {
          user: config.email.smtp.user,
          pass: config.email.smtp.pass,
        },
      });
      this.provider = 'smtp';
    } else {
      this.provider = 'console';
      logger.warn('No email provider configured, emails will be logged to console');
    }
  }

  async sendEmail(to, subject, html, text = null) {
    const emailData = {
      to,
      from: {
        email: config.email.from,
        name: config.email.name,
      },
      subject,
      html,
      text: text || this.htmlToText(html),
    };

    try {
      if (this.provider === 'sendgrid') {
        await sgMail.send(emailData);
      } else if (this.provider === 'smtp') {
        await this.transporter.sendMail(emailData);
      } else {
        logger.info('Email (console):', {
          to,
          subject,
          html,
        });
      }

      logger.info({ to, subject }, 'Email sent successfully');
      return true;
    } catch (error) {
      logger.error({ error, to, subject }, 'Failed to send email');
      throw error;
    }
  }

  async sendAgendamentoNotification(agendamento, tratamento) {
    const subject = `Novo agendamento: ${agendamento.nome}`;
    const html = `
      <h2>Novo Agendamento Recebido</h2>
      <p><strong>Nome:</strong> ${agendamento.nome}</p>
      <p><strong>Email:</strong> ${agendamento.email}</p>
      <p><strong>Telefone:</strong> ${agendamento.telefone}</p>
      <p><strong>Tratamento:</strong> ${tratamento.nome}</p>
      ${agendamento.dataAgendada ? `<p><strong>Data Agendada:</strong> ${new Date(agendamento.dataAgendada).toLocaleString('pt-BR')}</p>` : ''}
      ${agendamento.notas ? `<p><strong>Notas:</strong> ${agendamento.notas}</p>` : ''}
      <p><strong>Data de Envio:</strong> ${new Date(agendamento.dataEnvio).toLocaleString('pt-BR')}</p>
    `;

    // Enviar para o email configurado (admin)
    return this.sendEmail(config.email.from, subject, html);
  }

  async sendAgendamentoConfirmation(agendamento, tratamento) {
    const subject = `Agendamento Confirmado - ${tratamento.nome}`;
    const html = `
      <h2>Agendamento Confirmado!</h2>
      <p>Olá ${agendamento.nome},</p>
      <p>Seu agendamento foi confirmado com sucesso.</p>
      <p><strong>Tratamento:</strong> ${tratamento.nome}</p>
      ${agendamento.dataAgendada ? `<p><strong>Data:</strong> ${new Date(agendamento.dataAgendada).toLocaleString('pt-BR')}</p>` : ''}
      <p>Em breve entraremos em contato para confirmar os detalhes.</p>
      <p>Atenciosamente,<br>Equipe Clínica Odonto Azul</p>
    `;

    return this.sendEmail(agendamento.email, subject, html);
  }

  htmlToText(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

export default new EmailService();


