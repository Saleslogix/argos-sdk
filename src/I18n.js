export default function getResource(id) {
  return window.localeContext.getEntitySync(id).attributes;
}
