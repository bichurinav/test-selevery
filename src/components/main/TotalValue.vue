<script setup>
import useComputed from "@/composables/useComputed";
import useUpdateForce from "@/composables/useUpdateForce";
import { debounce } from "@/utils/helpers";
import { numsValid } from "@/utils/validations";
import { computed, watchEffect } from "vue";

const props = defineProps({
  data: { type: Array, default: () => [] },
  types: { type: Array, default: () => [] },
});

const emit = defineEmits(["updateData"]);

const variableData = computed(() => props.data[1]);
const computedData = computed(() => props.data[0]);

const { getResultFormula } = useComputed();

const { keyUpdateForce, updateKey } = useUpdateForce();

const formatResult = (value) => {
  if (typeof value === "boolean") {
    return value ? "Да" : "Нет";
  }
  return value;
};

watchEffect(() => {
  computedData.value.forEach((el) => {
    const result = getResultFormula(
      el.value,
      variableData.value,
      computedData.value,
      null,
      true
    );
    emit("updateData", {
      index: el.id,
      field: "result",
      value: result.value,
      idxNeededArray: 0,
    });
    emit("updateData", {
      index: el.id,
      field: "isValid",
      value: result.isValid,
      idxNeededArray: 0,
    });
  });
});

const booleanValues = computed(() => {
  const booleanType = props.types.find((el) => el.type === "boolean");
  return booleanType?.values ?? [];
});

const update = (e, item) => {
  const value = e.target.value;

  if (value === item.value) return;

  if ((item.type === "number" && !numsValid.validator(value)) || value === "") {
    emit("updateData", {
      index: item.id,
      field: "value",
      value: item.value,
      idxNeededArray: 1,
    });
    updateKey();
    return;
  }

  emit("updateData", {
    index: item.id,
    field: "value",
    value: value,
    idxNeededArray: 1,
  });
};

const updateVariableInput = debounce(update, 800);
</script>

<template>
  <div class="result">
    <div class="result-variables" :key="keyUpdateForce">
      Вводимые значения
      <div
        class="result-variables__item"
        v-for="variable in variableData"
        :key="variable.id"
      >
        <strong> {{ variable.name }} </strong>
        <select
          v-if="variable.type === 'boolean'"
          @change="(e) => update(e, variable)"
        >
          <option
            v-for="(value, idx) in booleanValues"
            :key="idx"
            :value="value"
            :selected="value === variable.value"
          >
            {{ value }}
          </option>
        </select>
        <input
          v-else
          @input="(e) => updateVariableInput(e, variable)"
          type="text"
          :value="variable.value"
        />
      </div>
    </div>
    <div class="result-table">
      <div
        v-for="item in computedData"
        :key="item.id"
        class="result-table__row"
      >
        <div class="result-table__cell">{{ item.name }}</div>
        <div class="result-table__cell">{{ formatResult(item.result) }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result {
  display: flex;
  justify-content: space-between;

  &-variables {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    &__item {
      display: inherit;
      flex-direction: inherit;
      row-gap: inherit;
    }
  }

  &-table {
    &__row {
      display: grid;
      grid-template-columns: 1fr 2fr;

      border: 1px solid black;

      &:not(:first-child) {
        border-top: 1px solid transparent;
      }
    }

    &__cell {
      padding: 15px;

      &:first-child {
        border-right: 1px solid black;
      }

      &:last-child {
        min-width: 200px;
      }
    }
  }
}
</style>
