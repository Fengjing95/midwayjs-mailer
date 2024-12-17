import { TemplateType, ITemplateRender } from '../index';

// ejs 模板渲染
const ejsRender: ITemplateRender = async (path, env = {}) => {
  return import('ejs').then(ejs => ejs.renderFile(path, env))
}

// pug 模板渲染
const pugRender: ITemplateRender = async (path, env = {}) => {
  return import('pug').then(pug => pug.renderFile(path, env))
}

// nunjucks 模板渲染
const nunjucksRender: ITemplateRender = async (path, env = {}) => {
  const buffer = await readFile(path);
  const template = buffer.toString();
  return import('nunjucks').then(nunjucks => nunjucks.renderString(template, env))
}

// 模板渲染方法映射
export const templateRender: Record<TemplateType, ITemplateRender> = {
  [TemplateType.EJS]: ejsRender,
  [TemplateType.PUG]: pugRender,
  [TemplateType.NUNJUCKS]: nunjucksRender,
}
