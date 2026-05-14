import fs from "fs";
const HISTORIC_FILE = "./locales/historic.json";

if (!fs.existsSync(HISTORIC_FILE)) {
  console.log("📜 Aucun historique trouvé.");
} else {
  const historic = JSON.parse(fs.readFileSync(HISTORIC_FILE, "utf8"));
  console.log("📜 Historique des lignes ecrites :");
  historic.forEach((line, i) => console.log(`  ${i + 1}. ${line}`));
}
