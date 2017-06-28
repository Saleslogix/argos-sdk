import lang from 'dojo/_base/lang';

export default function getResource(id) {
  const { defaultLocaleContext, localeContext, regionalContext } = window;
  if (!defaultLocaleContext || !localeContext) {
    return new Proxy({}, {
      properties: [],
      get(target, name) {
        if (name in target) {
          return target[name];
        }
        return '';
      },
    });
  }

  const defaultAttributes = defaultLocaleContext.getEntitySync(id).attributes;
  const currentAttributes = localeContext.getEntitySync(id).attributes;
  const regionalattributes = regionalContext.getEntitySync(id).attributes;

  lang.mixin(defaultAttributes, currentAttributes);
  return lang.mixin(defaultAttributes, regionalattributes);
}
