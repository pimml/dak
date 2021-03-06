// @dak

const arrayType = require('./types/arrayType');
const functionType = require('./types/functionType');
const getType = require('./types/getType');
const objectType = require('./types/objectType');
const primitiveType = require('./types/primitiveType');

const Types = new Map([
  ['Boolean', primitiveType],
  ['Number', primitiveType],
  ['String', primitiveType],
  ['Null', primitiveType],
  ['Undefined', primitiveType],
  ['Function', functionType],
  ['Array', arrayType],
  ['Object', objectType]
]);

function check(contents, typeDefs) {
  const results = typeDefs.map(typeDef => {
    let value;
    eval(contents + `\nvalue = ${typeDef.name};\n`);

    const valueType = getType(value);
    const isVariable = valueType === typeDef.types[0];

    if (isVariable) {
      return {check: 'success', name: typeDef.name};
    }

    return Types.has(valueType) ?
      Types.get(valueType)(valueType, typeDef, contents, value) : {};
  });

  return flatten(results);
}

// @type flatten :: Number -> String
function flatten(arr) {
  return arr.reduce((flat, toFlatten) => (
    flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  ), []);
}

module.exports = check;
