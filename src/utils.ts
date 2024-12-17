import { TemplateType, ITemplateRender } from '../index';
import { readFile } from 'node:fs/promises';

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

// 模板路径渲染方法映射
export const templateRender: Record<TemplateType, ITemplateRender> = {
  [TemplateType.EJS]: ejsRender,
  [TemplateType.PUG]: pugRender,
  [TemplateType.NUNJUCKS]: nunjucksRender,
}

// ejs 模板字符串渲染
const ejsRenderString: ITemplateRender = async (tpl, env = {}) => {
  return import('ejs').then(ejs => ejs.render(tpl, env))
}

// pug 模板字符串渲染
const pugRenderString: ITemplateRender = async (tpl, env = {}) => {
  return import('pug').then(pug => pug.render(tpl, env))
}

// nunjucks 模板字符串渲染
const nunjucksRenderString: ITemplateRender = async (tpl, env = {}) => {
  return import('nunjucks').then(nunjucks => nunjucks.renderString(tpl, env))
}

// 模板字符串渲染方法映射
export const templateStringRender: Record<TemplateType, ITemplateRender> = {
  [TemplateType.EJS]: ejsRenderString,
  [TemplateType.PUG]: pugRenderString,
  [TemplateType.NUNJUCKS]: nunjucksRenderString,
}
