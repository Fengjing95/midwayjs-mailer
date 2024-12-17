import {
  Config,
  ILogger,
  Inject,
  Logger,
  MidwayError,
  Provide,
} from '@midwayjs/core';
import { Transporter, SendMailOptions } from 'nodemailer';
import { MailerConfigurationType } from '../';
import { templateRender, templateStringRender } from './utils';

@Provide()
export class MailerService {
  @Inject()
  private mailer: Transporter;

  @Config('mailer')
  config: MailerConfigurationType;

  @Logger()
  private logger: ILogger;

  /**
   * 渲染模板
   * @param template 模板字符串
   * @param record 数据
   * @private
   */
  private async renderString(
    template: string,
    record: Record<string, unknown> = {}
  ) {
    if (!template) {
      this.logger.error('[mailer]: 模板不可为空');
      throw new MidwayError('template not allow null.', 'NOT_ALLOW_NULL');
    }

    return templateStringRender[this.config.template](template, record);
  }

  /**
   * 渲染指定路径的模板
   * @param path 模板路径
   * @param record 数据
   * @private
   */
  private async renderPath(path: string, record: Record<string, unknown> = {}) {
    return templateRender[this.config.template](path, record);
  }

  /**
   * 发送邮件
   * @param message 邮件消息对象
   * @param templateOptions 模板配置
   */
  async send(
    message: SendMailOptions,
    templateOptions?: {
      path?: string;
      templateStr?: string;
      record?: Record<string, unknown>;
      htmlStr?: string;
    }
  ) {
    let htmlStr: string = templateOptions?.htmlStr;

    if (!templateOptions?.htmlStr) {
      // html字符串，不需要渲染直接发送
      if (templateOptions?.templateStr) {
        // 使用模板字符串进行渲染
        htmlStr = await this.renderString(
          templateOptions.templateStr,
          templateOptions?.record
        );
      } else if (templateOptions?.path) {
        // 通过路径进行渲染
        htmlStr = await this.renderPath(
          templateOptions.path,
          templateOptions?.record
        );
      }
    }

    // 消息对象
    const msg = {
      ...message,
      from: message.from
        ? message.from
        : this.config.sender
        ? `${this.config.sender} <${this.config.auth.user}>`
        : this.config.auth.user,
      html: htmlStr,
      subject: this.config.prefix
        ? this.config.customSubjectRender?.(
            this.config?.prefix,
            message.subject
          ) || // 自定义标题格式
          `[${this.config.prefix}] ${message.subject}` // 前缀加标题
        : message.subject, // 默认标题
    };

    try {
      const result = await this.mailer.sendMail(msg);
      this.logger.info(`[mailer]: 邮件发送成功，${result.messageId}`);
      return result;
    } catch (e) {
      this.logger.error(`[mailer]: 邮件发送失败，${e.message}`);
      throw new MidwayError(e.message, 'MAIL_SEND_FAIL');
    }
  }
}
