import lang from 'dojo/_base/lang';

const deferredLocalizing = {};

export function ensureLocalized(id, context) {
  const { defaultLocaleContext, localeContext } = window;
  const localizedStrings = lang.mixin(
    defaultLocaleContext.getEntitySync(id).attributes,
    localeContext.getEntitySync(id).attributes
  );
  for (const prop in localizedStrings) {
    if (prop) {
      context[prop] = localizedStrings[prop];
    }
  }
}

export default function getResource(id) {
  const { defaultLocaleContext, localeContext } = window;
  if (!defaultLocaleContext || !localeContext) {
    deferredLocalizing[id] = [];
    return new Proxy({}, {
      properties: [],
      get(target, name) {
        if (name in target) {
          return target[name];
        }
        deferredLocalizing[id].push(name);
        return '';
      },
    });
  }

  const defaultAttributes = defaultLocaleContext.getEntitySync(id).attributes;
  const currentAttributes = localeContext.getEntitySync(id).attributes;
  return lang.mixin(defaultAttributes, currentAttributes);
}
