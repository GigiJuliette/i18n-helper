# txt-i18n

> Write translations in plain text, generate locale JSON files instantly.

No dashboard. No config hell. Just a structured `.txt` file and a single command.

---

## ✨ Features

- 📝 Write all your translations in a single readable `.txt` file
- ⚡ Generates one JSON file per locale automatically
- 🔄 Creates or updates keys — never overwrites unrelated content
- 🗑️ Removes processed lines from the helper file
- 📜 Keeps a full history of every processed translation
- ⚙️ Simple config file — no need to pass paths every time

---

## 📦 Installation

```bash
npm install -g txt-i18n
```

---

## 🚀 Quick Start

**1. Create your config file** at the root of your project:

```json
// txt-i18n.config.json
{
  "input": "./locales/helper.txt",
  "output": "./locales"
}
```

**2. Write your translations** in `helper.txt`:

```
# ORDER : en_GB | fr_FR | pl_PL

common.button.save : "save" | "enregistrer" | "ratować"
common.button.cancel : "cancel" | "annuler" | "anulować"
auth.login.title : "Sign in" | "Connexion" | "Zaloguj się"
```

**3. Run the command:**

```bash
txt-i18n
```

**That's it.** Your locale files are generated:

```json
// locales/en_GB.json
{
  "translation": {
    "common": {
      "button": {
        "save": "save",
        "cancel": "cancel"
      }
    },
    "auth": {
      "login": {
        "title": "Sign in"
      }
    }
  }
}
```

---

## 📄 Helper file format

```
# ORDER : en_GB | fr_FR | pl_PL        ← define locale order (required)

dot.path.to.key : "value" | "valeur" | "wartość"
```

- Lines starting with `#` are ignored
- Keys use dot notation and map directly to nested JSON
- Values are separated by `|` and follow the order defined in `# ORDER`
- Processed lines are automatically removed from the file

---

## 💻 Commands

```bash
txt-i18n              # process helper.txt and generate locale files
txt-i18n hist         # display the full history of processed translations
```

You can also override paths directly from the terminal:

```bash
txt-i18n ./path/to/helper.txt ./path/to/output
```

**Priority:** terminal args > `txt-i18n.config.json` > default values

---

## ⚙️ Config file

```json
{
  "input": "./locales/helper.txt",
  "output": "./locales",
  "historic": "./locales/historic.json"
}
```

| Key        | Default                   | Description                            |
| ---------- | ------------------------- | -------------------------------------- |
| `input`    | `./locales/helper.txt`    | Path to your helper file               |
| `output`   | `./locales`               | Directory where JSON files are written |
| `historic` | `./locales/historic.json` | Path to the history log                |

---

## 📜 History

Every time you run `txt-i18n`, processed lines are saved to `historic.json`.

```bash
txt-i18n hist

# 📜 History of processed translations:
#   1. common.button.save : "save" | "enregistrer" | "ratować"
#   2. common.button.cancel : "cancel" | "annuler" | "anulować"
```

---

## 🗂️ Project structure

```
your-project/
├── txt-i18n.config.json
└── locales/
    ├── helper.txt        ← write here
    ├── historic.json     ← auto-generated
    ├── en_GB.json        ← auto-generated
    ├── fr_FR.json        ← auto-generated
    └── pl_PL.json        ← auto-generated
```

---

## 📋 Example workflow

```bash
# 1. Add new keys to helper.txt
echo 'profile.title : "Profile" | "Profil" | "Profil"' >> locales/helper.txt

# 2. Generate locale files
txt-i18n

# 3. Check history anytime
txt-i18n hist
```

---

## 🪪 License

ISC © [GigiJuliette](https://github.com/GigiJuliette)
