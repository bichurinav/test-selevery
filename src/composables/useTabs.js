import { reactive, ref } from "vue";

export default (data) => {
  const modifiedData = data.map((el, idx) => {
    return { id: idx, ...el, active: idx == 0 };
  });

  const tabs = reactive(modifiedData);

  const activedTab = ref(tabs[0]);

  const _clearActiveTabs = () => {
    tabs.forEach((tab) => {
      tab.active = false;
    });
  };

  const setActiveTab = (tab) => {
    const neededTab = tabs.find((el) => el.id === tab.id);

    if (neededTab) {
      _clearActiveTabs();
      neededTab.active = true;
      activedTab.value = neededTab;
    }
  };

  return { tabs, setActiveTab, activedTab };
};
