<script>
import useTabs from "@/composables/useTabs";
import InputValue from "./components/main/InputValue.vue";
import ComputedValue from "./components/main/ComputedValue.vue";
import TotalValue from "./components/main/TotalValue.vue";
import FooterSave from "./components/FooterSave.vue";
import { reactive, computed } from "vue";
import { isEqualArray } from "./utils/helpers";
import storage from "./storage";

export default {
  components: { InputValue, ComputedValue, TotalValue, FooterSave },
  setup() {
    const store = storage();

    const TAB_VARIABLE = "Вводимые значения";
    const TAB_COMPUTED = "Вычисляемые значения";
    const TAB_RESULT = "Проверка расчетов";

    const { tabs, activedTab, setActiveTab } = useTabs([
      { name: TAB_VARIABLE, componentName: "InputValue" },
      { name: TAB_COMPUTED, componentName: "ComputedValue" },
      { name: TAB_RESULT, componentName: "TotalValue" },
    ]);

    const types = [
      { name: "Число", type: "number" },
      { name: "Логические значение", type: "boolean", values: ["Да", "Нет"] },
    ];

    const isVariableTab = computed(
      () => activedTab.value.name === TAB_VARIABLE
    );

    const isComputedTab = computed(
      () => activedTab.value.name === TAB_COMPUTED
    );

    const varibaleData = reactive(
      store.get("variableData") || [
        {
          id: 0,
          name: "A",
          type: "number",
          value: "25",
        },
        {
          id: 1,
          name: "B",
          type: "boolean",
          value: "Да",
        },
      ]
    );

    const computedData = reactive(
      store.get("computedData") || [
        {
          id: 0,
          name: "CompA",
          type: "number",
          value: "(Math.sqrt(A) + 25) * 2",
          isValid: true,
          result: 60,
        },
        {
          id: 1,
          name: "CompB",
          type: "boolean",
          value: "CompA === 60",
          isValid: true,
          result: false,
        },
      ]
    );

    const data = computed(() => {
      if (isVariableTab.value) {
        return reactive([varibaleData, computedData]);
      }
      return reactive([computedData, varibaleData]);
    });

    const updateData = ({ index, field, value, idxNeededArray = 0 }) => {
      data.value[idxNeededArray][index][field] = value;
      return;
    };

    const removeData = (index) => {
      data.value[0].splice(index, 1);
    };

    const addData = (item) => {
      data.value[0].push(item);
    };

    const saveDataStorage = (cb) => {
      if (isVariableTab.value) {
        if (isEqualArray(varibaleData, store.get("variableData"))) return;
        store.set("variableData", varibaleData);
        cb();
        return;
      }
      if (isComputedTab.value) {
        if (isEqualArray(computedData, store.get("computedData"))) return;
        store.set("computedData", computedData);
        cb();
        return;
      }
      if (
        isEqualArray(varibaleData, store.get("variableData")) &&
        isEqualArray(computedData, store.get("computedData"))
      )
        return;
      store.set([varibaleData, computedData]);
      cb();
    };

    const clearDataStorage = (cb) => {
      if (isVariableTab.value) {
        if (!store.get("variableData")) return;
        store.clear("variableData");
        cb();
        return;
      }
      if (isComputedTab.value) {
        if (!store.get("computedData")) return;
        store.clear("computedData");
        cb();
        return;
      }
      if (!store.get("variableData") && !store.get("computedData")) return;
      store.clear(["variableData", "computedData"]);
      cb();
    };

    return {
      tabs,
      activedTab,
      setActiveTab,
      types,
      data,
      updateData,
      removeData,
      addData,
      saveDataStorage,
      clearDataStorage,
    };
  },
};
</script>

<template>
  <div class="page">
    <div class="container">
      <main class="page__main">
        <TabsBase :tabs="tabs" @setActiveTab="setActiveTab" />
        <h1 class="page__title">{{ activedTab.name }}</h1>
        <component
          :is="activedTab.componentName"
          :data="data"
          :types="types"
          @updateData="updateData"
          @removeData="removeData"
          @addData="addData"
        />
      </main>
      <FooterSave
        @saveData="saveDataStorage"
        @clearData="clearDataStorage"
        class="page__footer"
      />
    </div>
  </div>
</template>

<style lang="scss">
.page {
  padding-top: 30px;
  height: inherit;

  &__title {
    margin: 30px 0;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__main {
    flex: 1 0 auto;
  }

  &__footer {
    flex: 0 0 auto;
  }
}
</style>
