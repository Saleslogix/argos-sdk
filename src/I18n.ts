import * as lang from 'dojo/_base/lang';

export default function getResource(id) {
  const { defaultLocaleContext, localeContext, regionalContext } = window as any;
  if (!defaultLocaleContext || !localeContext) {
    return new Proxy({}, {
      properties: [],
      get(target, name) {
        if (name in target) {
          return target[name];
        }
        return '';
      }
    } as any);
  }

  const defaultAttributes = defaultLocaleContext.getEntitySync(id).attributes;
  const currentAttributes = localeContext.getEntitySync(id).attributes;

  const regionalattributes = regionalContext.getEntitySync(id).attributes;
  lang.mixin(defaultAttributes, regionalattributes);
  return lang.mixin(defaultAttributes, currentAttributes);
}
