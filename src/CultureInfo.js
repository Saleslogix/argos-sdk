import lang from 'dojo/_base/lang';

const localeContext = window.localeContext;
const entity = localeContext.getEntitySync('CultureInfo');

if (!entity) {
  throw new Error('Failed loading CultureInfo.');
}

const parsed = JSON.parse(entity.value);
export default lang.setObject('Mobile.CultureInfo', parsed);
