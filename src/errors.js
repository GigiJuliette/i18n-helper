export class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ValidationError";
    Object.assign(this, details);
  }
}

export function printPrettyValidationError(error, inputFile) {
  console.error("\n========================================");
  console.error(`❌ Erreur de validation dans ${inputFile}`);

  if (typeof error.lineNumber === "number") {
    console.error(`Ligne ${error.lineNumber}`);
  }
  if (error.path) {
    console.error(`Clé: ${error.path}`);
  }
  if (
    typeof error.received === "number" &&
    typeof error.expected === "number"
  ) {
    console.error(`Valeurs trouvées: ${error.received}`);
    console.error(`Valeurs attendues: ${error.expected}`);
  }
  if (error.line) {
    console.error(`Contenu: ${error.line}`);
  }

  console.error(`Détail: ${error.message}`);
  console.error(
    'Exemple attendu: common.button.save : "save" | "enregistrer" | "ratować"',
  );
  console.error("========================================\n");
}
