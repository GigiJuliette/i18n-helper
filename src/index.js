import fs from "fs";
import { ValidationError, printPrettyValidationError } from "./errors.js";

const HISTORIC_FILE = "./locales/historic.json";

let historic = [];

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
function parseLine(line, locales, lineNumber) {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) {
    throw new ValidationError('Format invalide: ":" manquant.', {
      line,
      lineNumber,
    });
  }

  const dotPath = line.slice(0, colonIndex).trim();
  const values = line
    .slice(colonIndex + 1)
    .split("|")
    .map((s) => s.trim().replace(/^"|"$/g, ""));

  if (values.length !== locales.length) {
    throw new ValidationError(`Nombre de valeurs invalide pour "${dotPath}".`, {
      line,
      lineNumber,
      path: dotPath,
      received: values.length,
      expected: locales.length,
    });
  }

  return {
    path: dotPath,
    translations: Object.fromEntries(locales.map((loc, i) => [loc, values[i]])),
  };
}
/**
 * Save l'historique dans un json
 */
function saveHistoric(newLines) {
  let existing = [];
  if (fs.existsSync(HISTORIC_FILE)) {
    try {
      existing = JSON.parse(fs.readFileSync(HISTORIC_FILE, "utf8"));
    } catch {
      existing = []; // fichier vide ou corrompu → on repart de zéro
    }
  }
  fs.writeFileSync(
    HISTORIC_FILE,
    JSON.stringify([...existing, ...newLines], null, 2),
    "utf8",
  );
}

/**
 * Point d'entrée principal
 */
export function processFile(inputFile, outputDir) {
  // 1. Lire l'ordre des locales depuis le fichier
  const locales = parseOrder(inputFile);
  console.log("📋 Locales :", locales);

  const rawLines = fs.readFileSync(inputFile, "utf8").split("\n");
  const indicesToRemove = [];

  const translationLines = rawLines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.trim() && !line.startsWith("#"));

  const newLines = translationLines.map(({ line }) => line);
  historic.push(...newLines);
  saveHistoric(newLines);

  for (const { line, index } of translationLines) {
    const { path, translations } = parseLine(line, locales, index + 1);
    let allWritten = true;

    for (const [locale, value] of Object.entries(translations)) {
      const result = upsertTranslation(
        `${outputDir}/${locale}.json`,
        path,
        value,
      );
      console.log(
        `${result.isNew ? "✅ added" : "🔄 updated"} [${locale}] ${path} = "${value}"`,
      );
      if (!result) allWritten = false;
    }

    if (allWritten) {
      indicesToRemove.push(index);
      console.log(`🗑️ à supprimer : "${line.trim()}"`);
    }
  }

  indicesToRemove.sort((a, b) => b - a);
  for (const i of indicesToRemove) rawLines.splice(i, 1);

  fs.writeFileSync(inputFile, rawLines.join("\n"), "utf8");
  console.log(
    `✅ ${indicesToRemove.length} line(s) added to locale(s) file(s)`,
  );
}

const INPUT_FILE = "./locales/helper.txt";
const OUTPUT_DIR = "./locales";
