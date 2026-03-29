import { resolve } from "path";

export default {
  root: "./pages",
  build: {
    outDir: "../public",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve("./pages/index.html"),
        tariffs: resolve("./pages/tariffs.html"),
        calculator: resolve("./pages/calculator.html"),
        about: resolve("./pages/about.html"),
        contact: resolve("./pages/contact.html"),
      },
    },
  },
};
