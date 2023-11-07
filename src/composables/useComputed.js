import { variableValid, numsValid } from "@/utils/validations";
import { isBalancedBrackets, isBalancedTernary } from "@/utils/helpers";

export default () => {
  const cacheFormula = new Map();

  const accessSymbols = [
    "(",
    ")",
    "*",
    "-",
    "/",
    "?",
    ":",
    "+",
    "??",
    "||",
    "&&",
    ">",
    "<",
    "<=",
    ">=",
    "==",
    "===",
  ];

  const mathPatern =
    /Math\.(pow|sqrt|abs|acosh|asin|abs|cos|round|log2|log10|log|floor|ceil)\(.+\)/;

  const getResultFormula = (
    value,
    variableData,
    computedData,
    currentComputedName = "",
    isUpdate = false
  ) => {
    const result = {
      isValid: true,
      value: null,
    };

    const checkNextPrevOperator = (arr, idx) => {
      if (arr[idx + 1]) {
        if (!accessSymbols.includes(arr[idx + 1])) {
          result.isValid = false;
        }
      }
      if (arr[idx - 1]) {
        if (!accessSymbols.includes(arr[idx - 1])) {
          result.isValid = false;
        }
      }
    };

    if (!value) {
      result.isValid = false;
      return result;
    }

    if (!isUpdate) {
      if (cacheFormula.has(value)) {
        return cacheFormula.get(value);
      }
    }

    let strList = value.split(/(?<!,)\s/gi);
    const brackets = value.match(/[\()]/g) ?? [];

    strList = strList.filter((el) => el !== "" && el !== undefined);

    if (brackets.length > 0 && !isBalancedBrackets(brackets)) {
      result.isValid = false;
      return result;
    }

    const arResult = strList.map((el, idx, arr) => {
      const brackets = el.match(/[\(\)]/g, "");
      let symbol = el.replace(/[\(\)]/g, "");
      let leftBracket = "";
      let rightBracket = "";

      if (brackets && /[\(]/g.test(brackets)) {
        leftBracket = brackets.join("");
      }

      if (brackets && /[\)]/g.test(brackets)) {
        rightBracket = brackets.join("");
      }

      if (mathPatern.test(el)) {
        return el.replace(/(Math\..+)\((.+)\)/, (...match) => {
          let res = match[2].split(",");
          res.forEach((el, idx) => {
            if (variableValid.validator(el.trim())) {
              const neededVariable = variableData.find(
                (variable) => variable.name === el.trim()
              );

              if (!neededVariable) {
                const neededComputedVar = computedData.find(
                  (variable) =>
                    variable.name === el.trim() &&
                    currentComputedName !== el.trim()
                );

                if (!neededComputedVar) {
                  result.isValid = false;
                  return;
                }

                res[idx] = neededComputedVar.result;

                return;
              }

              if (neededVariable.value === "Да") {
                res[idx] = "true";
                return;
              }

              if (neededVariable.value === "Нет") {
                res[idx] = "false";
                return;
              }

              res[idx] = neededVariable.value;
              return;
            }
            if (numsValid.validator(el.trim())) {
              return;
            }
          });

          return match[1] + "(" + res.join(",") + ")";
        });
      }

      if (/.+[\(\)].+/.test(el)) {
        result.isValid = false;
        return;
      }

      if (idx === 0) {
        if (accessSymbols.includes(symbol)) {
          result.isValid = false;
          return;
        }
      }

      if (idx === arr.length - 1) {
        if (accessSymbols.includes(symbol)) {
          result.isValid = false;
          return;
        }
      }

      if (variableValid.validator(symbol)) {
        checkNextPrevOperator(arr, idx);

        const neededVariable = variableData.find(
          (variable) => variable.name === symbol
        );

        if (!neededVariable) {
          const neededComputedVar = computedData.find(
            (variable) =>
              variable.name === el.trim() && currentComputedName !== el.trim()
          );

          if (!neededComputedVar) {
            result.isValid = false;
            return;
          }

          return leftBracket + neededComputedVar.result + rightBracket;
        }

        if (neededVariable.value === "Да") {
          return leftBracket + "true" + rightBracket;
        }
        if (neededVariable.value === "Нет") {
          return leftBracket + "false" + rightBracket;
        }

        return leftBracket + neededVariable.value + rightBracket;
      }

      if (numsValid.validator(symbol)) {
        if (arr.length === 1) {
          result.isValid = false;
          return;
        }

        if (symbol.charAt(0) === "-") {
          if (arr[idx] - 1 && arr[idx - 1] === "-") {
            result.isValid = false;
            return;
          }
        }

        checkNextPrevOperator(arr, idx);
        return leftBracket + symbol + rightBracket;
      }

      if (accessSymbols.includes(symbol)) {
        return symbol;
      }

      result.isValid = false;
    });

    if (!isBalancedTernary(arResult)) {
      result.isValid = false;
    }

    if (result.isValid) {
      result.value = eval(arResult.join(""));

      if (result.value) {
        cacheFormula.set(value, result);
      }
    }

    return result;
  };

  return {
    getResultFormula,
  };
};
