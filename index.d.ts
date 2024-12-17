import { Options } from 'nodemailer/lib/smtp-connection';
import { TemplateTypeEnum } from './dist';
export * from './dist/index';

// 模板渲染函数接口
export type ITemplateRender = (
  path: string,
  env?: Record<string, unknown>
) => Promise<string>;

export type MailerConfigurationType = {
  prefix?: string;
  customSubjectRender?: (prefix: string, subject: string) => string;
  template?: TemplateTypeEnum;
  // customRender?: ITemplateRender;
  sender?: string;
} & Options;

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    mailer?: MailerConfigurationType;
  }
}
