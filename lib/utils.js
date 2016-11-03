exports.lookup = function(root, fields) {
  if (!root) { return null; }

  if (typeof fields === 'string') {
    fields = [fields];
  }

  for (var i = 0; i < fields.length; i++) {
    var obj = root;
    var field = fields[i];
    var chain = field.split(']').join('').split('[');
    for (var j = 0, len = chain.length; j < len; j++) {
      var prop = obj[chain[j]];
      if (prop === null || prop === undefined) { break; }
      if (typeof(prop) !== 'object') { return prop; }
      obj = prop;
    }
  }
  return null;
};
