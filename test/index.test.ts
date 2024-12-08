import { createLightApp } from '@midwayjs/mock';
import * as mailer from '../src';
import { join } from 'path';

describe('/test/index.test.ts', () => {
  it('template render', async () => {
    const app = await createLightApp(
      join(__dirname, './fixtures/templateMail'),
      {
        imports: [mailer],
      }
    );
    const mailerService = await app
      .getApplicationContext()
      .getAsync(mailer.MailerService);

    await mailerService.send(
      {
        subject: 'templateMail',
        from: '小枫 <youemail@qq.com>',
        to: 'xxxx@qq.com',
      },
      {
        path: join(__dirname, './fixtures/templateMail/src/template/order.ejs'),
        record: { orderId: 'BL20241208160753' },
      }
    );
  });

  it('custom prefix render', async () => {
    const app = await createLightApp(join(__dirname, './fixtures/normalMail'), {
      imports: [mailer],
    });
    const mailerService = await app
      .getApplicationContext()
      .getAsync(mailer.MailerService);

    await mailerService.send({
      subject: 'custom prefix render',
      to: 'xxxx@qq.com',
      text: 'Hello!',
    });
  });
});
