import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private sendGridEnabled: boolean;
  private smtpEnabled: boolean;
  private smtpTransporter: nodemailer.Transporter | null = null;

  constructor() {
    this.sendGridEnabled = !!env.SENDGRID_API_KEY;
    this.smtpEnabled = !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

    if (this.sendGridEnabled) {
      sgMail.setApiKey(env.SENDGRID_API_KEY);
      logger.info('SendGrid configurado');
    }

    if (this.smtpEnabled) {
      this.smtpTransporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
      logger.info('SMTP configurado');
    }

    if (!this.sendGridEnabled && !this.smtpEnabled) {
      logger.warn('Nenhum serviço de email configurado. Emails serão apenas logados.');
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (this.sendGridEnabled) {
        await sgMail.send({
          from: {
            email: env.EMAIL_FROM,
            name: env.EMAIL_FROM_NAME,
          },
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || options.html.replace(/<[^>]*>/g, ''),
        });
        logger.info(`Email enviado via SendGrid para ${options.to}`);
        return true;
      }

      if (this.smtpTransporter) {
        await this.smtpTransporter.sendMail({
          from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM}>`,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || options.html.replace(/<[^>]*>/g, ''),
        });
        logger.info(`Email enviado via SMTP para ${options.to}`);
        return true;
      }

      // Fallback: apenas logar
      logger.info('Email (simulado):', {
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return true;
    } catch (error) {
      logger.error('Erro ao enviar email:', error);
      return false;
    }
  }

  async sendAgendamentoConfirmacao(
    email: string,
    nome: string,
    tratamento?: string
  ): Promise<boolean> {
    const subject = 'Agendamento Recebido - Clínica Odonto Azul';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0A4DA2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Clínica Odonto Azul</h1>
            </div>
            <div class="content">
              <h2>Olá, ${nome}!</h2>
              <p>Recebemos seu agendamento com sucesso.</p>
              ${tratamento ? `<p><strong>Tratamento:</strong> ${tratamento}</p>` : ''}
              <p>Nossa equipe entrará em contato em breve para confirmar os detalhes.</p>
              <p>Em caso de dúvidas, entre em contato pelo telefone: <strong>(67) 99104-9439</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 Clínica Odonto Azul. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to: email, subject, html });
  }

  async sendAgendamentoNotificacaoAdmin(
    adminEmail: string,
    agendamento: {
      nome: string;
      email: string;
      telefone: string;
      tratamento?: string;
    }
  ): Promise<boolean> {
    const subject = 'Novo Agendamento - Clínica Odonto Azul';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0A4DA2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Novo Agendamento Recebido</h1>
            </div>
            <div class="content">
              <table>
                <tr><td class="label">Nome:</td><td>${agendamento.nome}</td></tr>
                <tr><td class="label">Email:</td><td>${agendamento.email}</td></tr>
                <tr><td class="label">Telefone:</td><td>${agendamento.telefone}</td></tr>
                ${agendamento.tratamento ? `<tr><td class="label">Tratamento:</td><td>${agendamento.tratamento}</td></tr>` : ''}
              </table>
              <p style="margin-top: 20px;">Acesse o painel administrativo para visualizar e gerenciar este agendamento.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to: adminEmail, subject, html });
  }
}

export const emailService = new EmailService();
export default emailService;

