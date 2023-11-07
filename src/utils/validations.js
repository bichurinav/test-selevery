export const emptyValid = {
  error: "Пустое поле",
  validator: (value) => value !== "",
};

export const numsValid = {
  error: "Только числа",
  validator: (value) => /^(\-)?\d+(?:\.\d+)?$/.test(value),
};

export const variableValid = {
  error: "Неверный формат переменной",
  validator: (value) => /^[^\W\d](\w)*?$/i.test(value),
};
