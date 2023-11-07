<script setup>
import { ref } from "vue";

const emit = defineEmits(["saveData", "clearData"]);

const message = ref("");
let timeout = null;

const showMessage = (msg) => {
  message.value = msg;
  timeout = setTimeout(() => {
    message.value = "";
    timeout = null;
  }, 2000);
};

const saveData = () => {
  if (timeout) return;
  emit("saveData", () => {
    showMessage("Ваши данные сохранены");
  });
};

const clearData = () => {
  if (timeout) return;
  emit("clearData", () => {
    showMessage("Ваши данные очищены");
  });
};
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__message">
        {{ message }}
      </p>
      <ButtonBase @click="saveData" class="footer__button">
        Сохранить
      </ButtonBase>
      <ButtonBase @click="clearData" class="footer__button" variant="secondary">
        Очистить
      </ButtonBase>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  margin-top: 20px;
  border-radius: 10px 10px 0 0;
  width: 100%;
  background: #fff;

  &__inner {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 16px;
  }

  &__button {
    width: 150px;
  }
}
</style>
