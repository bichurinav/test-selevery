<script setup>
import { reactive, computed } from "vue";
import useUpdateForce from "@/composables/useUpdateForce";
import useComputed from "@/composables/useComputed";
import useValidation from "@/composables/useValidation";
import { variableValid } from "@/utils/validations";
import { isExist } from "@/utils/helpers";

const props = defineProps({
  types: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
});

const emit = defineEmits(["addData", "updateData", "removeData"]);

const inputs = reactive({
  initialValue: "",
  selectType: "",
  variableName: "",
});

const data = computed(() => props.data[0]);
const variableData = computed(() => props.data[1]);

const { getResultFormula } = useComputed();

const { errorMessage, clearErrorMessage, checkVariableData, setErrorMessage } =
  useValidation();

const { keyUpdateForce, updateKey } = useUpdateForce();

const updateTable = (item) => {
  const index = data.value.findIndex((el) => el.id === item.id);

  const checkCorrectType = (value, type, existResult = null, computedName) => {
    const result =
      existResult ||
      getResultFormula(
        value,
        variableData.value,
        [...data.value],
        computedName
      );

    if (typeof result.value !== type) {
      setErrorMessage("Несоотвествие типа данных с формулой");
      emit("updateData", { index, field: "isValid", value: false });
      emit("updateData", { index, field: "result", value: null });
      return false;
    }
    clearErrorMessage();
    return true;
  };

  if (item.field === "value") {
    const result = getResultFormula(
      item.value,
      variableData.value,
      [...data.value],
      item.name
    );

    if (checkCorrectType(item.value, item.type, result, item.name)) {
      emit("updateData", { index, field: "isValid", value: result.isValid });
      emit("updateData", { index, field: "result", value: result.value });
    }
    emit("updateData", { index, field: "value", value: item.value });
    return;
  }

  if (item.field === "type" && item.computedValue) {
    emit("updateData", { index, field: "type", value: item.value });
    if (checkCorrectType(item.computedValue, item.value, null, item.name)) {
      emit("updateData", { index, field: "isValid", value: true });
    }
    return;
  }

  if (
    item.field === "name" &&
    (item.value === "" ||
      !variableValid.validator(item.value) ||
      isExist(item.value, data.value, "name"))
  ) {
    emit("updateData", { index, field: "name", value: item.oldValue });
    updateKey();
    return;
  }

  emit("updateData", { index, field: item.field, value: item.value });
};

const clearInputs = () => {
  Object.keys(inputs).forEach((key) => {
    inputs[key] = "";
  });
};

const addVariable = () => {
  const isValid = checkVariableData(
    inputs.variableName,
    inputs.selectType,
    inputs.initialValue,
    data.value,
    true
  );

  const result = getResultFormula(
    inputs.initialValue,
    variableData.value,
    data.value
  );

  if (!result.isValid) {
    setErrorMessage("Неправильный формат формулы");
    return;
  }

  if (typeof result.value !== inputs.selectType) {
    setErrorMessage("Несоотвествие типа данных с формулой");
    return;
  }

  if (isValid) {
    clearErrorMessage();

    emit("addData", {
      id: data.value.at(-1)?.id + 1,
      name: inputs.variableName,
      type: inputs.selectType,
      value: inputs.initialValue,
      isValid: result.isValid,
      result: result.value,
    });

    clearInputs();
  }
};

const removeCell = (item) => {
  const index = data.value.findIndex((el) => el.id === item.id);
  emit("removeData", index);
};
</script>

<template>
  <p class="advice">При написании формулы, учитывайте пробелы</p>
  <TableBase
    isComputed
    :key="keyUpdateForce"
    :titles="['Переменная', 'Тип', 'Формула', '']"
    :data="data"
    :types="props.types"
    @updateTable="updateTable"
    @removeCell="removeCell"
  >
    <template #footer>
      <tr>
        <td>
          <input
            v-model="inputs.variableName"
            type="text"
            placeholder="Переменная"
          />
        </td>
        <td>
          <select v-model="inputs.selectType">
            <option disabled selected value="">Выберите тип</option>
            <option
              v-for="(type, idx) in props.types"
              :key="type.type + idx"
              :value="type.type"
            >
              {{ type.name }}
            </option>
          </select>
        </td>
        <td>
          <input
            v-model="inputs.initialValue"
            type="text"
            placeholder="Значение"
            :disabled="inputs.selectType === ''"
          />
        </td>
      </tr>
    </template>
  </TableBase>
  <ButtonBase @click="addVariable" class="mt-20">
    Добавить переменную
  </ButtonBase>
  <div class="error-message" v-if="errorMessage">
    {{ errorMessage }}
  </div>
</template>

<style lang="scss" scoped>
.advice {
  font-size: 14px;
  color: rgb(148, 148, 148);
  margin: 10px 0;
}
</style>
