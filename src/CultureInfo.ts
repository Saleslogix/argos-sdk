const lang = require( 'dojo/_base/lang');

export default function () {
  const localeContext = (window as any).regionalContext;
  const entity = localeContext.getEntitySync('CultureInfo');

  if (!entity) {
    throw new Error('Failed loading CultureInfo.');
  }

  const parsed = JSON.parse(entity.value);
  lang.setObject('Mobile.CultureInfo', parsed);
}
