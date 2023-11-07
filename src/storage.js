const storage = () => {
  const data = {
    variableData: localStorage.getItem("variableData") || null,
    computedData: localStorage.getItem("computedData") || null,
  };

  return {
    get(key) {
      data[key] = localStorage.getItem(key) || null;
      return JSON.parse(data[key]);
    },

    set(key, item = {}) {
      if (Array.isArray(key)) {
        Object.keys(data).forEach((stateKey, idx) => {
          localStorage.setItem(stateKey, JSON.stringify(key[idx]));
        });

        return;
      }

      localStorage.setItem(key, JSON.stringify(item));
    },

    clear(key) {
      if (Array.isArray(key)) {
        key.forEach((key) => {
          localStorage.setItem(key, "");
          data[key] = null;
        });

        return;
      }

      localStorage.setItem(key, "");
      data[key] = null;
    },
  };
};

export default storage;
