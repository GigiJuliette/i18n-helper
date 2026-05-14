#!/usr/bin/env node
import fs from "fs";
import { processFile } from "../src/index.js";
import { ValidationError, printPrettyValidationError } from "../src/errors.js";

let config = {};
if (fs.existsSync("./txt-i18n.config.json")) {
  config = JSON.parse(fs.readFileSync("./txt-i18n.config.json", "utf8"));
}

const command = process.argv[2];

// ── commande hist ──────────────────────────────────────
if (command === "hist") {
  const HISTORIC_FILE = config.historic ?? "./locales/historic.json";

  if (!fs.existsSync(HISTORIC_FILE)) {
    console.log("Aucun historique trouvé.");
    process.exit(0);
  }

  const historic = JSON.parse(fs.readFileSync(HISTORIC_FILE, "utf8"));
  console.log();
  console.log(
    "________________ Historique des lignes traitées ________________",
  );
  console.log();

  historic.forEach((line) => console.log(line));

  console.log(
    "________________________________________________________________",
  );
  console.log();
  process.exit(0);
}

// ── commande principale ────────────────────────────────
const inputFile = command ?? config.input ?? "./locales/helper.txt";
const outputDir = process.argv[3] ?? config.output ?? "./locales";

try {
  processFile(inputFile, outputDir);
} catch (error) {
  if (error instanceof ValidationError) {
    printPrettyValidationError(error, inputFile);
    process.exit(1);
  }
  throw error;
}
