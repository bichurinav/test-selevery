<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator(value) {
      return ["primary", "secondary"].includes(value);
    },
  },
});

const classes = computed(() => {
  const arClasses = [];

  if (props.variant === "secondary") {
    arClasses.push("button--secondary");
  }

  return arClasses;
});
</script>

<template>
  <button class="button" :class="classes">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@import "@styles/_colors";

.button {
  border: 1px solid transparent;
  display: inline-flex;
  text-decoration: none;
  justify-content: center;
  align-items: center;
  background: $primary;
  color: #fff;
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    transform: scale(0.777);
  }

  &--secondary {
    color: $secondary;
    background: transparent;
    border: 1px solid lighten($secondary, 15%);
  }
}
</style>
