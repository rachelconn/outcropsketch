# Setup
1. Make sure you have npm installed (tested with version 6.14.4, if you have a lower version then try updating it if you are unable to build the project).
2. Run the following command in your console to install dependencies:
```bash
cd src
npm i
```

# Building
This project uses webpack in order to provide benefits like ES2018 syntax, TypeScript, and `.tsx`/`.jsx` file support.
As such, make sure you build the project whenever you make changes with the following commands:
```bash
cd src
npm run build
```

# Running
After building, open `index.html` and you should see the application.
