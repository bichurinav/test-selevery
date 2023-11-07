<script setup>
const props = defineProps({
  tabs: { type: Array, default: () => [] },
});

const emit = defineEmits(["setActiveTab"]);

const setActiveTab = (tab) => {
  emit("setActiveTab", tab);
};
</script>

<template>
  <div class="tabs">
    <button
      class="tabs__item"
      v-for="(tab, idx) in props.tabs"
      :key="idx"
      :disabled="tab.active"
      @click="setActiveTab(tab)"
    >
      {{ tab.name }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import "@styles/_colors";

.tabs {
  border-bottom: 1px solid silver;
  display: flex;
  column-gap: 40px;

  &__item {
    position: relative;
    color: gray;
    font-size: 18px;
    padding-bottom: 10px;

    &:disabled {
      cursor: not-allowed;
      color: black;

      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: 0;
        background: $primary;
      }
    }
  }
}
</style>
