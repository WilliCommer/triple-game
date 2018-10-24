/* 
 */

module.exports = {
  getProp:   getProp,
  checkProp: checkProp
};


function getProp (dst, src, name, deflt) {
  if (!src || !dst || !name) return false;
  if (src[name] === undefined) {
    if (deflt !== undefined) dst[name] = deflt;
    return false;
  }
  dst[name] = src[name];
  return true;
}

function checkProp (dst,name,deflt) {
  if (!dst || !name || !deflt || (dst[name] !== undefined)) return false;
  dst[name] = deflt;
  return true;
}


