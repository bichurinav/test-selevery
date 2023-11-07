import { createApp } from "vue";
import "@styles/main.scss";
import App from "./App.vue";
import UIComponents from "./components/ui";

const app = createApp(App);

UIComponents.forEach((c) => {
  app.component(c.__name, c);
});

app.mount("#app");
