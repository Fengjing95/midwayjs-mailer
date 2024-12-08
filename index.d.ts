import { Options } from 'nodemailer/lib/smtp-connection';
export * from './dist/index';

export type TemplateType = 'ejs';

export type MailerConfigurationType = {
  prefix?: string;
  customSubjectRender?: (prefix: string, subject: string) => string;
  template?: TemplateType;
  sender?: string;
} & Options;

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    mailer?: MailerConfigurationType;
  }
}
