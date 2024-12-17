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
import { readFile } from 'node:fs/promises';
import ejs = require('ejs');

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
   * @param tplString 模板字符串
   * @param record 数据
   * @private
   */
  private renderTemplate(tplString: string, record: Record<string, unknown>) {
    let html = '';

    if (!tplString) {
      this.logger.error('[mailer]: 模板不可为空');
      throw new MidwayError('template not allow null.', 'NOT_ALLOW_NULL');
    }

    html = ejs.render(tplString, record);

    return html;
  }

  /**
   * 发送邮件
   * @param message 邮件消息对象
   * @param templateOptions 模板配置
   */
  async send(
    message: SendMailOptions,
    templateOptions?: {
      path: string;
      record?: Record<string, unknown>;
      htmlStr?: string;
    }
  ) {
    let htmlStr: string = templateOptions?.htmlStr;

    // 渲染模板，配置开启了模板渲染并传入模板路径时进行渲染，传入了htmlStr直接使用
    if (this.config.template && templateOptions?.path && !htmlStr) {
      const { path, record } = templateOptions;
      const buffer = await readFile(path);
      const template = buffer.toString();
      // 使用模板引擎，先进行渲染
      htmlStr = this.renderTemplate(template, record);
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
