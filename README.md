# Setup
1. Make sure you have npm installed (tested with version 6.14.4, if you have a lower version then try updating it if you are unable to build the project).
2. Run the following command in your console to install dependencies:
```bash
npm i
```

# Building
This project uses webpack for compilation in order to provide benefits like ES2018 syntax, TypeScript, and `.tsx`/`.jsx` file support.
Running the following command will make webpack watch files for changes and automatically recompile when you make changes:
```bash
npm run dev
```
To create a minified production build instead, run:
```bash
npm run build
```

# Running
After building, open `index.html` and you should see the application.
