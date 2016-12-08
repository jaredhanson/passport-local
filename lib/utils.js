exports.lookup = function(root, fields) {
  if (!root) { return null; }

  if (typeof fields === 'string') {
    fields = [fields];
  }

  for (let i = 0; i < fields.length; i++) {
    let obj = root;
    const field = fields[i];
    const chain = field.split(']').join('').split('[');
    for (let j = 0, len = chain.length; j < len; j++) {
      var prop = obj[chain[j]];
      if (prop === null || prop === undefined) { break; }
      if (typeof(prop) !== 'object') { return prop; }
      obj = prop;
    }
  }
  return null;
};
