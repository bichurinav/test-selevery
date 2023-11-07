import { ref } from "vue";
import { variableValid, emptyValid, numsValid } from "@/utils/validations";
import { isExist } from "@/utils/helpers";

export default () => {
  const errorMessage = ref("");

  const checkVariableData = (
    fieldName,
    fieldType,
    fieldValue,
    data,
    isComputed
  ) => {
    errorMessage.value = "";

    if (!emptyValid.validator(fieldName)) {
      errorMessage.value = emptyValid.error;
    }

    if (!variableValid.validator(fieldName)) {
      errorMessage.value = variableValid.error;
    }

    if (isExist(fieldName, data, "name")) {
      errorMessage.value = "Такая переменная уже есть!";
    }

    if (!emptyValid.validator(fieldValue)) {
      errorMessage.value = emptyValid.error;
    }

    if (
      fieldType === "number" &&
      !numsValid.validator(fieldValue) &&
      !isComputed
    ) {
      errorMessage.value = numsValid.error;
    }

    return errorMessage.value === "";
  };

  const clearErrorMessage = () => {
    errorMessage.value = "";
  };

  const setErrorMessage = (message) => {
    errorMessage.value = message;
  };

  return {
    errorMessage,
    clearErrorMessage,
    setErrorMessage,
    checkVariableData,
  };
};
