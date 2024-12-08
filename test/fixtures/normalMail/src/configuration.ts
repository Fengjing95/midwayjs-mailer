import { Configuration } from '@midwayjs/core';
import { join } from 'path';
import * as mailer from '../../../../src';

@Configuration({
  imports: [mailer],
  importConfigs: [join(__dirname, 'config')],
})
export class AutoConfiguration {
  async onReady(app) {}
}
