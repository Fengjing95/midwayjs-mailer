import { Options } from 'nodemailer/lib/smtp-connection';
export * from './dist/index';

// 模板渲染函数接口
type ITemplateRender = (path: string, env?: Record<string, any>) => Promise<string>;

// 支持的模板渲染的类型
export enum TemplateType {
  EJS = 'ejs',
  PUG = 'pug',
  NUNJUCKS = 'nunjucks',
};

export type MailerConfigurationType = {
  prefix?: string;
  customSubjectRender?: (prefix: string, subject: string) => string;
  template?: TemplateType;
  // customRender?: ITemplateRender;
  sender?: string;
} & Options;

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    mailer?: MailerConfigurationType;
  }
}
