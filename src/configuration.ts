import {
  Config,
  Configuration,
  IMidwayContainer,
  MidwayError,
} from '@midwayjs/core';
import { Transporter, createTransport } from 'nodemailer';
import { MailerConfigurationType } from '../index';

/**
 * 判断对象是否为空
 * @param obj 对象
 */
function isEmpty(obj: MailerConfigurationType) {
  return !obj || Object.keys(obj).length === 0;
}

@Configuration({
  namespace: 'mailer',
  importConfigs: [
    {
      default: {},
    },
  ],
})
export class MailerConfiguration {
  @Config('mailer')
  private readonly mailer: MailerConfigurationType;

  async onReady(container: IMidwayContainer) {
    if (!isEmpty(this.mailer)) {
      const mailer = createTransport(this.mailer);
      container.registerObject('mailer', mailer);
    } else {
      throw new MidwayError('mailer config error【mailer 配置不可为空】');
    }
  }

  async onStop(container: IMidwayContainer) {
    const isMailer = container.hasObject('mailer');
    if (isMailer) {
      const mailer: Transporter = await container.getAsync('mailer');
      mailer?.close();
    }
  }
}
