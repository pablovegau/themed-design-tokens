import { DEFAULT_THEMES, SEPARATOR } from "./constants";

function isObject(obj) {
  return !!(typeof obj === "object");
}

function transformTokensToString(tokensObject) {
  return Object.entries(tokensObject)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}

function createTokensObjects(prefix, values, themesTokens, themes) {
  for (const key in values) {
    const newPrefix = prefix + SEPARATOR + key.replace("_", "-").toLowerCase();
    if (isObject(values[key])) {
      createTokensObjects(newPrefix, values[key], themesTokens, themes);
    } else {
      const themesKeys = Object.keys(themes);

      if (themesKeys.includes(key)) {
        themesTokens[`${key.toLowerCase()}`][prefix] = values[key];
      } else if (key === "DEFAULT") {
        themesKeys.forEach((KEY) => {
          themesTokens[`${KEY.toLowerCase()}`][prefix] = values.DEFAULT;
        });
      } else {
        themesTokens.root[newPrefix] = values[key];
      }
    }
  }
}

function getTokensObject(values, themes, prefix = "") {
  //  The tokens will be saved here, separated in objects:
  //    - root: where lives tokens without theme
  //    - [theme]: where lives tokens with theme, one object per theme
  const tokens = {
    root: {}
  };

  // We create the theme tokens object
  for (const theme in themes) {
    tokens[`${themes[theme]}`] = {};
  }

  createTokensObjects(prefix, values, tokens, themes);

  return tokens;
}

function getTokensString(tokens) {
  tokens = {
    ...tokens,
  }

  let allThemesTokens = [];

  for (const themeKey in tokens) {
    if (themeKey === "root") {
      // The root tokens will be attached to the :root
      allThemesTokens.push(`
        :root {
          ${transformTokensToString(tokens.root)}
        }
    `);
    } else {
      // For each theme we will create a data-theme property
      // in the body were the tokens will be attackeds

      allThemesTokens.push(`
        [data-theme="${themeKey}"] {
          ${transformTokensToString(tokens[themeKey])}
        }
      `);
    }
  }

  return allThemesTokens;
}

function getTokens(values, themes, prefix = "") {
  const tokens = getTokensObject(values, themes, prefix);

  return getTokensString(tokens);
}

// Esta función lo que hace es generar todos las custom properties basadas en los valores y los temas que recibe
// como parametros y los inyecta en el head del documento
export function initializeTheme({
  values,
  themes = DEFAULT_THEMES,
  prefix = ""
}) {
  const style = document.createElement("style");
  document.head.appendChild(style);

  const tokens = getTokens(values, themes, prefix);

  tokens.forEach((rule) => {
    style.sheet.insertRule(rule);
  });


}
