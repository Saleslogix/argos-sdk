import lang from 'dojo/_base/lang';

export default function getResource(id) {
  const defaultAttributes = window.defaultLocaleContext.getEntitySync(id).attributes;
  const currentAttributes = window.localeContext.getEntitySync(id).attributes;
  return lang.mixin(defaultAttributes, currentAttributes);
}
