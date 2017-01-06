import Utility from './Utility';

function expand(expression, ...args) {
  if (typeof expression === 'function') {
    return expression.apply(this, args);
  }

  return expression;
}

export function normalizeCustomizationSet(customizationSet, customizationSubSet) {
  if (customizationSubSet) {
    return `${customizationSet}/${customizationSubSet}`;
  }

  return customizationSet;
}

export function getCustomizationSetKey(customizationSet, id, customizationSubSet) {
  customizationSet = normalizeCustomizationSet(customizationSet, customizationSubSet);
  const key = `${customizationSet}#${id}`;
  return key;
}

function _createCustomizedLayout(layout, customizations, customizationSet, id, customizationSubSet) {
  customizationSet = normalizeCustomizationSet(customizationSet, customizationSubSet);

  if (customizations && customizations.length > 0) {
    return compileCustomizedLayout(customizations, layout, null);//eslint-disable-line
  }

  return layout;
}

export const createCustomizedLayout = Utility.memoize(_createCustomizedLayout, (_, __, customizationSet, id, customizationSubSet) => {
  return getCustomizationSetKey(customizationSet, id, customizationSubSet);
});

export function compileCustomizedLayout(customizations, layout, parent) {
  const customizationCount = customizations.length;
  const layoutCount = layout.length;
  const applied = {};
  let output;

  if (Array.isArray(layout)) {
    output = [];
    for (let i = 0; i < layoutCount; i++) {
      let row = layout[i];

      /* for compatibility */
      // will modify the underlying row
      if (typeof row.name === 'undefined' && typeof row.property === 'string') {
        row.name = row.property;
      }

      const insertRowsBefore = [];
      const insertRowsAfter = [];

      for (let j = 0; j < customizationCount; j++) {
        if (applied[j]) {
          continue; // todo: allow a customization to be applied to a layout more than once?
        }

        const customization = customizations[j];
        let stop = false;

        if (expand(customization.at, row, parent, i, layoutCount, customization)) {
          switch (customization.type) {//eslint-disable-line
            case 'remove':
              // full stop
              stop = true;
              row = null;
              break;
            case 'replace':
              // full stop
              stop = true;
              row = expand(customization.value, row);
              break;
            case 'modify':
              // make a shallow copy if we haven't already
              if (row === layout[i]) {
                row = Object.assign({}, row);
              }

              row = Object.assign(row, expand(customization.value, row));
              break;
            case 'insert'://eslint-disable-line
              const insertRowsTarget = (customization.where !== 'before') ? insertRowsAfter : insertRowsBefore;
              const expandedValue = expand(customization.value, row);

              if (Array.isArray(expandedValue)) {
                insertRowsTarget.push.apply(insertRowsTarget, expandedValue); //eslint-disable-line
              } else {
                insertRowsTarget.push(expandedValue);
              }

              break;
          }

          applied[j] = true;
        }

        if (stop) {
          break;
        }
      }

      output.push.apply(output, insertRowsBefore);//eslint-disable-line

      if (row) {
        const children = (row.children && 'children') || (row.as && 'as');
        if (children) {
          // make a shallow copy if we haven't already
          if (row === layout[i]) {
            row = Object.assign({}, row);
          }

          row[children] = compileCustomizedLayout(customizations, row[children], row);
        }

        output.push(row);
      }
      output.push.apply(output, insertRowsAfter);//eslint-disable-line
    }
    /*
     for any non-applied, insert only, customizations, if they have an `or` property that expands into a true expression
     the value is applied at the end of the parent group that the `or` property (ideally) matches.
    */
    for (let k = 0; k < customizationCount; k++) {
      if (applied[k]) {
        continue;
      }

      const customization = customizations[k];

      if (customization.type === 'insert' && (expand(customization.or, parent, customization) || (customization.at === true))) {
        output.push(expand(customization.value, null));
      }
    }
  } else if (typeof layout === 'function') {
    return compileCustomizedLayout(customizations, layout.call(this), name);
  } else if (typeof layout === 'object' && layout !== null) {
    output = {};

    for (const name in layout) {
      if (Array.isArray(layout[name])) {
        output[name] = compileCustomizedLayout(customizations, layout[name], name);
      } else {
        output[name] = layout[name];
      }
    }
  }

  return output;
}
