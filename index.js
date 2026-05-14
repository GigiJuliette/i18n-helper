import fs from "fs";
import yaml from "js-yaml";

const newTranslation = JSON.parse(
  fs.readFileSync("./locales/json.json", "utf8"),
);
const allNew = newTranslation[Object.keys(newTranslation)[0]];
// const data = JSON.parse(fs.readFileSync("config.json", "utf8"));

// data.age = 31;
// data.ville = "Lyon";

// fs.writeFileSync("config.json", JSON.stringify(data, null, 2));

console.log(newTranslation[Object.keys(newTranslation)[0]]);
console.log();
