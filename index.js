import fs from "fs";

/**
 * Lit la ligne # ORDER et retourne le tableau de locales
 * # ORDER : en_GB | fr_FR | pl_PL  →  ["en_GB", "fr_FR", "pl_PL"]
 */
function parseOrder(inputFile) {
  const lines = fs.readFileSync(inputFile, "utf8").split("\n");

  const orderLine = lines.find((l) => l.trim().startsWith("# ORDER"));
  if (!orderLine)
    throw new Error('Aucune ligne "# ORDER" trouvée dans le fichier');

  const [, values] = orderLine.split(":").map((s) => s.trim());
  return values.split("|").map((s) => s.trim());
}

/**
 * Écrit une clé imbriquée dans un JSON — crée si absent, update si présent
 */
function upsertTranslation(filePath, dotPath, value) {
  let data = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  const keys = ("translation." + dotPath).split(".");
  const lastKey = keys.pop();
  let current = data;

  for (const key of keys) {
    if (typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  const isNew = !(lastKey in current);
  current[lastKey] = value;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  return { isNew, path: dotPath, value };
}

/**
 * Parse une ligne de traduction
 * "common.button.save : "save" | "enregistrer" | "ratować""
 */
function parseLine(line, locales) {
  const colonIndex = line.indexOf(":");
  const dotPath = line.slice(0, colonIndex).trim();
  const values = line
    .slice(colonIndex + 1)
    .split("|")
    .map((s) => s.trim().replace(/^"|"$/g, ""));

  return {
    path: dotPath,
    translations: Object.fromEntries(locales.map((loc, i) => [loc, values[i]])),
  };
}

/**
 * Point d'entrée principal
 */
function processFile(inputFile, outputDir) {
  // 1. Lire l'ordre des locales depuis le fichier
  const locales = parseOrder(inputFile);
  console.log("📋 Locales détectées :", locales);

  const lines = fs
    .readFileSync(inputFile, "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"));

  for (const line of lines) {
    const { path, translations } = parseLine(line, locales);

    for (const [locale, value] of Object.entries(translations)) {
      const result = upsertTranslation(
        `${outputDir}/${locale}.json`,
        path,
        value,
      );
      console.log(
        `${result.isNew ? "✅ added" : "🔄 updated"} [${locale}] ${path} = "${value}"`,
      );
    }
  }
}

processFile("./locales/helper.txt", "./locales");
