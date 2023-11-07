<script setup>
import { watch, reactive, computed } from "vue";
import useUpdateForce from "@/composables/useUpdateForce";
import useValidation from "@/composables/useValidation";
import { numsValid, variableValid } from "@/utils/validations";
import { isExist } from "@/utils/helpers";

const props = defineProps({
  types: { type: Array, default: () => [] },
  data: { type: Object, default: () => {} },
});

const emit = defineEmits(["addData", "updateData", "removeData"]);

const inputs = reactive({
  selectType: "",
  variableName: "",
  initialValue: "",
});

const { errorMessage, clearErrorMessage, checkVariableData } = useValidation();

const data = computed(() => props.data[0]);

watch(
  () => inputs.selectType,
  () => {
    inputs.initialValue = "";
    clearErrorMessage();
  }
);

const { keyUpdateForce, updateKey } = useUpdateForce();

const updateTable = (item) => {
  const index = data.value.findIndex((el) => el.id === item.id);

  if (item.field === "type") {
    switch (item.value) {
      case "boolean":
        emit("updateData", { index, field: "value", value: "Да" });
        break;
      case "number":
        emit("updateData", { index, field: "value", value: "0" });
        break;
      default:
        emit("updateData", { index, field: "value", value: "" });
    }
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

  if (
    item.field === "value" &&
    ((item.type === "number" && !numsValid.validator(item.value)) ||
      item.value === "")
  ) {
    emit("updateData", { index, field: "value", value: item.oldValue });
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
    data.value
  );

  if (isValid) {
    clearErrorMessage();

    emit("addData", {
      id: data.value.at(-1)?.id + 1,
      name: inputs.variableName,
      type: inputs.selectType,
      value: inputs.initialValue,
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
  <TableBase
    :key="keyUpdateForce"
    :titles="['Переменная', 'Тип', 'Начальное значение', '']"
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
        <td v-if="inputs.selectType === 'boolean'">
          <select v-model="inputs.initialValue">
            <option disabled selected value="">Выберите значение</option>
            <option value="Да">Да</option>
            <option value="Да">Нет</option>
          </select>
        </td>
        <td v-else>
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

<style lang="scss" scoped></style>
