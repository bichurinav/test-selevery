import { ref } from "vue";

export default () => {
  const keyUpdateForce = ref(0);

  const updateKey = () => {
    if (keyUpdateForce.value) {
      keyUpdateForce.value = 0;
    } else {
      keyUpdateForce.value = 1;
    }
  };

  return { updateKey, keyUpdateForce };
};
