Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memoize = (function() {
  function R(args1, args2) {
    return [].slice.call(args1).every(function(arg, i) {
      return arg === args2[i];
    });
  }
  return function(fn, maxMemoizations, reconciler) {
    var maxSize = Math.min(
      Math.max(1, Math.floor(isNaN(maxMemoizations) ? 1 : maxMemoizations)),
      Number.MAX_VALUE
    ),
      memoizedResults = [],
      isEqual = typeof reconciler == "function" ? reconciler : R;
    return function() {
      var args = arguments,
        result = memoizedResults.find(function(result) {
          return isEqual(args, result[0]);
        });
      if (result) {
        return result[1];
      }
      if (memoizedResults.length == maxSize) {
        memoizedResults.shift();
      }
      result = fn.apply(this, arguments);
      memoizedResults.push([arguments, result]); // memoize
      return result;
    }.bind(this);
  };
})();
