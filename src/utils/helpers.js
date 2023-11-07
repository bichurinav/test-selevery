export function debounce(func, timeout = 300) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function isExist(value, array, field) {
  return array.some((el) => el[field] === value);
}

export function isBalancedBrackets(brackets) {
  const stack = [];
  for (const symbol of brackets) {
    if (symbol === "(") {
      stack.push(symbol);
    } else if (symbol === ")") {
      if (!stack.pop()) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

export function isBalancedTernary(arr) {
  const res = [];

  arr.forEach((el) => {
    if (el === ":") {
      res.push(el);
      return;
    }
    if (el === "?") {
      res.push(el);
      return;
    }
  });

  if (res.length === 0) {
    return true;
  }

  if (res.length === 1) {
    return false;
  }

  if (res.length > 2) {
    return false;
  }

  if (res[0] === ":") {
    return false;
  }

  return true;
}

export function isEqualArray(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}
