# Setup
1. Make sure you have npm installed (tested with version 6.14.4, if you have a lower version then try updating it if you are unable to build the project).
2. Run the following command in your console to install dependencies:
```bash
npm i
npm i --global webpack ts-node
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


# File Conversion for Outcrop Sketch .json files
1. If it doesn't already exist, create a folder named `input` in the root directory of the project
2. Put all the .json files you want to convert in the `input` folder
3. Run the following command to convert all .json files into image and .csv files:
```bash
npm run convert-json
```
4. Check the `converted/x` folder to find the source images, and `converted/y` for .csv label files.
5. Run the following command to convert the `.csv` files into `.png` files with labels:
```bash
python utils/csv_to_png.py
```
6. Check the `converted/StructureTypeLabels` folder for the structure types, and `converted/StructureTypeLabels` for surface types.
