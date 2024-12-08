export const mailer = {
  host: 'smtp.qq.com',
  secureConnection: true,
  auth: {
    user: 'youremail@xx.com',
    pass: 'xxxx',
  },
  sender: '小枫',
  prefix: 'MyApp',
  customSubjectRender: (prefix, subject) => {
    return `【${prefix}】 ${subject}`;
  },
};
