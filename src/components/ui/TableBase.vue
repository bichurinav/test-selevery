<script setup>
import { computed, onUpdated, ref, reactive } from "vue";
import { debounce } from "@/utils/helpers";

const props = defineProps({
  titles: { type: Array, default: () => [] },
  types: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  isComputed: { type: Boolean, default: false },
});

const emit = defineEmits(["updateTable", "removeCell"]);

const update = (e, item, field) => {
  if (e.target.tagName === "DIV") {
    sessionStorage.setItem("focusItem", e.target.id);
  }

  const value = e.target.value || e.target.textContent;
  const data = {
    id: item.id,
    field,
    name: item.name,
    type: item.type,
    oldValue: item[field],
    value,
    computedValue: Boolean(e.target.dataset["typeComputed"])
      ? item.value
      : null,
  };
  emit("updateTable", data);
};

const booleanValues = computed(() => {
  const booleanType = props.types.find((el) => el.type === "boolean");
  return booleanType?.values ?? [];
});

const updateTableInput = debounce(update, 800);

const removeCell = (item) => {
  emit("removeCell", item);
};

onUpdated(() => {
  const nodeID = sessionStorage.getItem("focusItem");
  if (nodeID) {
    const sel = window.getSelection();
    const range = new Range();
    const node = document.getElementById(nodeID);
    range.selectNodeContents(node);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    if (!/inputFormula-\d+/.test(nodeID)) {
      range.startContainer.blur();
    }
    sessionStorage.setItem("focusItem", "");
  }
});
</script>

<template>
  <table class="table">
    <thead class="table-head">
      <tr>
        <th class="table-head__title" v-for="(title, idx) in titles" :key="idx">
          {{ title }}
        </th>
      </tr>
    </thead>
    <tbody v-if="props.data.length > 0">
      <tr class="table-row" v-for="(item, idx) in data" :key="idx + item.name">
        <td class="table-row__cell">
          <div
            class="table__input"
            contenteditable
            @input="(e) => updateTableInput(e, item, 'name')"
          >
            {{ item.name }}
          </div>
        </td>
        <td class="table-row__cell">
          <select
            :data-type-computed="isComputed"
            @change="(e) => update(e, item, 'type')"
          >
            <option
              v-for="(type, idx) in props.types"
              :key="type.type + idx"
              :value="type.type"
              :selected="type.type === item.type"
            >
              {{ type.name }}
            </option>
          </select>
        </td>
        <td
          class="table-row__cell"
          v-if="item.type === 'boolean' && !isComputed"
        >
          <select @change="(e) => update(e, item, 'value')">
            <option
              v-for="(value, idx) in booleanValues"
              :key="idx"
              :value="value"
              :selected="value === item.value"
            >
              {{ value }}
            </option>
          </select>
        </td>
        <td class="table-row__cell" v-else>
          <div
            class="table__input"
            :class="{
              'table__input--error': props.isComputed && !item.isValid,
            }"
            :id="props.isComputed ? `inputFormula-${idx}` : `inputValue-${idx}`"
            contenteditable
            @input="(e) => updateTableInput(e, item, 'value')"
          >
            {{ item.value }}
          </div>
        </td>
        <td class="table-row__cell">
          <button @click="removeCell(item)" class="table-row__remove-button">
            <img width="24" height="24" src="/trash.svg" alt="" />
          </button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <slot name="footer" />
    </tfoot>
  </table>
</template>

<style lang="scss">
@import "@styles/_colors";

.table {
  border-collapse: collapse;

  &-head {
    border-bottom: solid 1px silver;
    &__title {
      font-weight: bold;
      color: gray;
      border-right: solid 1px silver;
      text-align: left;

      &:last-child {
        border-right: none;
      }
    }
  }

  &-row {
    &__remove-button {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;

      &:active {
        transform: scale(0.6);
      }
    }
  }

  &__input {
    border: 1px solid transparent;

    &--error {
      background: rgb(226, 103, 103);
      color: #fff;
    }

    &:focus {
      outline-style: dashed;
    }

    &:hover {
      border: 1px solid $primary;
    }
  }

  th,
  td {
    &:first-child {
      padding: 10px 10px 10px 0;
    }

    padding: 10px;
  }
}
</style>
