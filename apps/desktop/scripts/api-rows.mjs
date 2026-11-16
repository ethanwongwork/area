/**
 * A family's API rows, generated (system evaluation 2026-11-11, F5; GOVERNANCE § 7): the variant axes, their values
 * and defaults from the manifest (packages/styles/src/manifest.ts), and every other prop, its type, default and
 * description from the `*Props` interfaces and their JSDoc in packages/react, read with the TypeScript compiler.
 * `pages.mjs` keeps only the rows neither source holds (a sub-part's shape, a note on native props); a hand row that
 * restates a generated prop is an error (tests/api-rows.test.ts).
 *
 * Read at build time as `virtual:api-rows` (build.mjs and dev.mjs add the plugin), and by the parity test
 * (packages/styles/scripts/manifest-parity.test.mjs) for each prop's resolved values.
 *
 *   node apps/desktop/scripts/api-rows.mjs [slug…]   prints the rows of those families (all with no slug)
 */
import { readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const here = dirname(fileURLToPath(import.meta.url));
export const repo = resolve(here, "../../..");
const COMPONENTS = "packages/react/src/components";
const MANIFEST = "packages/styles/src/manifest.ts";
const PAGES = "apps/desktop/src/content/pages.mjs";

const camel = value => value.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const lowerFirst = value => value[0].toLowerCase() + value.slice(1);
const quote = value => JSON.stringify(value);

/** Every file the rows are read from (the plugin watches them). */
export const apiSourceFiles = root => [
  ...readdirSync(join(root, COMPONENTS)).filter(name => /\.tsx?$/.test(name)).map(name => join(root, COMPONENTS, name)),
  join(root, "packages/react/src/variants.ts"), join(root, MANIFEST), join(root, PAGES),
];

/* --- React props ---------------------------------------------------------------------------------------------- */

const flat = text => text.replace(/\s+/g, " ").trim();
const docOf = (symbol, checker) => flat(ts.displayPartsToString(symbol.getDocumentationComment(checker)));
const tagsOf = symbol => Object.fromEntries(symbol.getJsDocTags().map(tag => [tag.name, flat(ts.displayPartsToString(tag.text ?? []))]));

/** The string literals a type resolves to, without undefined; undefined when it is not a union of literals only. */
function literalsOf(type) {
  const parts = type.isUnion() ? type.types : [type];
  const out = [];
  for (const part of parts) {
    if (part.flags & ts.TypeFlags.Undefined) continue;
    if (part.isStringLiteral()) out.push(part.value);
    else return undefined;
  }
  return out.length ? out : undefined;
}

/** A type's top-level union members ("A | (x: B | C) => void" -> ["A", "(x: B | C) => void"]); a function is wrapped in
 * parentheses, so a union of several reads unambiguously. */
function topLevelUnion(text) {
  const out = [];
  let depth = 0;
  let part = "";
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if ("([{<".includes(char)) depth++;
    else if (")]}".includes(char) || (char === ">" && text[index - 1] !== "=")) depth--;
    if (char === "|" && depth === 0) { out.push(part.trim()); part = ""; continue; }
    part += char;
  }
  out.push(part.trim());
  // A branch that rules a prop out (`options?: undefined` beside `items`) adds nothing to what it takes.
  return out.filter(member => member && member !== "undefined" && member !== "never").map(member => /=>/.test(member) && !/^\(.*\)$/.test(member) ? `(${member})` : member);
}

/** `{ a = 1, b }` destructured from a component's props: name -> initializer text. */
function bindingDefaults(binding, sourceFile) {
  const out = {};
  for (const element of binding.elements) {
    if (element.dotDotDotToken || !element.initializer) continue;
    const name = (element.propertyName ?? element.name).getText(sourceFile);
    out[name] = element.initializer.getText(sourceFile).replace(/\s+/g, " ");
  }
  return out;
}

/**
 * Every exported `*Props` interface or type in packages/react's components: Name -> { file, props }, each prop
 * { name, type (as written), literals (the resolved string values, or undefined), mapped (from the manifest through
 * VariantProps, so written nowhere in React), owner (the interface that declares it), manifestTyped (its type is written
 * from the manifest), narrowed (an Exclude<…> of it), aliases (values it keeps as deprecated aliases), default, doc, deprecated, file, line }.
 * Only Area's own members count: those a native or React type declares (onClick, disabled on a button) are the
 * element's, documented by the platform.
 */
export function reactProps(root = repo) {
  const dir = join(root, COMPONENTS);
  const files = readdirSync(dir).filter(name => /\.tsx?$/.test(name)).map(name => join(dir, name));
  const config = ts.readConfigFile(join(root, "packages/react/tsconfig.json"), ts.sys.readFile).config;
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, join(root, "packages/react"));
  const program = ts.createProgram(files, { ...options, noEmit: true });
  const checker = program.getTypeChecker();
  const own = path => path.startsWith(join(root, "packages/react/src")) || path.startsWith(join(root, "packages/styles"));

  // Defaults written in a component's code, after a prop's `@default` tag: where it destructures its props, in the
  // parameter (forwardRef<E, XProps>(function X({ a = 1 }) …), function X({ a = 1 }: XProps), memo(…) included) or in
  // the body (`const { a = 1 } = props`), else as `const a = props.a ?? 1` (or `const b = a ?? 1` on a destructured
  // `a`), the fallback a constant. `fallbacks` keeps each destructured prop the code still falls back for with a
  // constant (`a ?? "md"`), so a prop no form gives a default for can be reported to carry `@default` (unreadDefaults).
  const defaults = {};
  const fallbacks = {};
  const strip = node => {
    while (node && (ts.isAsExpression(node) || ts.isParenthesizedExpression(node) || ts.isNonNullExpression(node) || ts.isSatisfiesExpression?.(node))) node = node.expression;
    return node;
  };
  const constant = node => !!node && (ts.isStringLiteral(node) || ts.isNumericLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
    || node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword
    || (ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand)));
  const visit = (node, sourceFile) => {
    if (ts.isFunctionLike(node) && node.parameters?.[0]) {
      const param = node.parameters[0];
      let typeName;
      if (param.type && ts.isTypeReferenceNode(param.type)) typeName = param.type.typeName.getText(sourceFile);
      else {
        let call = node.parent;
        while (call && !ts.isCallExpression(call)) call = ts.isParenthesizedExpression(call) || ts.isAsExpression(call) ? call.parent : undefined;
        const arg = call?.typeArguments?.[1];
        if (arg && ts.isTypeReferenceNode(arg)) typeName = arg.typeName.getText(sourceFile);
      }
      if (typeName?.endsWith("Props")) {
        const found = {};
        const bound = new Set();
        const bind = pattern => {
          for (const element of pattern.elements) if (!element.dotDotDotToken && ts.isIdentifier(element.name)) bound.add(element.name.text);
          Object.assign(found, bindingDefaults(pattern, sourceFile));
        };
        // The props object: the parameter, or the rest of its destructuring (`{ a = 1, ...props }`).
        const propsNames = new Set(ts.isIdentifier(param.name) ? [param.name.text]
          : param.name.elements.filter(element => element.dotDotDotToken && ts.isIdentifier(element.name)).map(element => element.name.text));
        if (ts.isObjectBindingPattern(param.name)) bind(param.name);
        const isProps = expression => ts.isIdentifier(strip(expression) ?? {}) && propsNames.has(strip(expression).text);
        const falls = new Set();
        const late = {};
        const body = child => {
          // A nested component is its own (a part declared inside another's body).
          if (child !== node && ts.isFunctionLike(child) && child.parameters?.[0] && !ts.isArrowFunction(child)) return;
          if (ts.isVariableDeclaration(child) && child.initializer) {
            if (ts.isObjectBindingPattern(child.name) && isProps(child.initializer)) bind(child.name);
            const init = strip(child.initializer);
            // const a = props.a ?? 1
            if (ts.isIdentifier(child.name) && init && ts.isBinaryExpression(init) && init.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
              && ts.isPropertyAccessExpression(strip(init.left)) && isProps(strip(init.left).expression) && constant(strip(init.right))) {
              found[strip(init.left).name.text] ??= strip(init.right).getText(sourceFile);
            }
            // const shape = layout ?? "bar", on a destructured prop: its default, when a constant.
            if (ts.isIdentifier(child.name) && init && ts.isBinaryExpression(init) && init.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
              && ts.isIdentifier(strip(init.left)) && bound.has(strip(init.left).text) && constant(strip(init.right))) {
              late[strip(init.left).text] ??= strip(init.right).getText(sourceFile);
            }
          }
          // a ?? "md": a constant the code falls back to for an unset prop (not `value ?? local`, a controlled prop's own).
          if (ts.isBinaryExpression(child) && child.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
            && ts.isIdentifier(strip(child.left) ?? {}) && constant(strip(child.right))) falls.add(strip(child.left).text);
          ts.forEachChild(child, body);
        };
        if (node.body) ts.forEachChild(node.body, body);
        defaults[typeName] = { ...late, ...found, ...defaults[typeName] };
        fallbacks[typeName] = new Set([...(fallbacks[typeName] ?? []), ...[...falls].filter(name => bound.has(name))]);
      }
    }
    ts.forEachChild(node, child => visit(child, sourceFile));
  };

  // Does a type mention a pattern, directly or through an alias or another props' member (AssetCardProps["container"])?
  // Written from the manifest: VariantProps, MANIFESTS or a *Variants helper; narrowed: Exclude<…>.
  const mentions = (pattern, node, seen = new Set()) => {
    if (!node) return false;
    if (pattern.test(node.getText(node.getSourceFile()))) return true;
    let found = false;
    const walk = child => {
      if (found) return;
      if (ts.isTypeReferenceNode(child)) {
        let symbol = checker.getSymbolAtLocation(child.typeName);
        if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
        const index = ts.isIndexedAccessTypeNode(child.parent) && ts.isLiteralTypeNode(child.parent.indexType) ? child.parent.indexType.literal.text : undefined;
        for (const declaration of symbol?.getDeclarations() ?? []) {
          if (seen.has(declaration) || !own(declaration.getSourceFile().fileName)) continue;
          seen.add(declaration);
          const member = index && ts.isInterfaceDeclaration(declaration) ? declaration.members.find(m => m.name?.getText() === index) : undefined;
          if (mentions(pattern, ts.isTypeAliasDeclaration(declaration) ? declaration.type : member?.type, seen)) found = true;
        }
      }
      ts.forEachChild(child, walk);
    };
    walk(node);
    return found;
  };
  const MANIFEST_TYPES = /\bMANIFESTS\b|\bVariantProps\b|\w+Variants\b/;
  // Values a union marks `/** @deprecated … */ "value"`: aliases kept for a release (Step's "done").
  const deprecatedValues = new Set();
  for (const file of files) for (const [, value] of ts.sys.readFile(file).matchAll(/@deprecated[^*]*\*\/\s*"([\w-]+)"/g)) deprecatedValues.add(value);

  const out = {};
  for (const sourceFile of program.getSourceFiles()) {
    if (!files.includes(sourceFile.fileName)) continue;
    visit(sourceFile, sourceFile);
    for (const statement of sourceFile.statements) {
      if (!(ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement))) continue;
      if (!statement.name.text.endsWith("Props") || !statement.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
      const type = checker.getTypeAtLocation(statement.name);
      const props = [];
      // A discriminated union (Calendar's selectionMode single | range | multiple) is read branch by branch: a prop every
      // branch has is one row with every branch's values; a prop only some have says when it applies.
      const branches = type.isUnion() ? type.types.filter(branch => !(branch.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null))) : [type];
      const symbols = [...checker.getPropertiesOfType(type)];
      for (const branch of branches) for (const symbol of checker.getPropertiesOfType(branch)) {
        if (!symbols.some(s => s.name === symbol.name)) symbols.push(checker.getPropertyOfType(type, symbol.name) ?? symbol);
      }
      const inBranches = name => branches.filter(branch => checker.getPropertyOfType(branch, name));
      // The discriminant: a prop every branch has, a different literal in each.
      const discriminant = branches.length > 1 ? symbols.find(symbol => {
        if (inBranches(symbol.name).length !== branches.length) return false;
        const values = branches.map(branch => literalsOf(checker.getTypeOfSymbol(checker.getPropertyOfType(branch, symbol.name))));
        return values.every(Boolean) && new Set(values.flat()).size === values.flat().length;
      })?.name : undefined;
      const when = name => {
        const some = inBranches(name);
        if (some.length === branches.length || !discriminant) return "";
        const values = some.flatMap(branch => literalsOf(checker.getTypeOfSymbol(checker.getPropertyOfType(branch, discriminant))) ?? []);
        return ` Only with \`${discriminant}\` ${values.map(value => `\`${value}\``).join(" or ")}.`;
      };
      for (const symbol of symbols) {
        // A prop VariantProps maps from a manifest is declared in the manifest, or nowhere (a boolean's camel name).
        const declarations = symbol.getDeclarations() ?? [];
        if (!declarations.every(d => own(d.getSourceFile().fileName))) continue;
        if (/^(data|aria)-/.test(symbol.name)) continue;
        const declaration = declarations.find(d => d.getSourceFile().fileName.startsWith(dir));
        const branchDeclarations = declarations.filter(d => ts.isPropertySignature(d) && d.type && d.getSourceFile().fileName.startsWith(dir));
        // Declared in more than one branch: the union of every branch's type, each once.
        const valueType = branchDeclarations.length > 1 ? checker.getTypeOfSymbol(symbol) : checker.getTypeOfSymbolAtLocation(symbol, declaration ?? statement);
        const written = branchDeclarations.length > 1
          ? [...new Set(branchDeclarations.flatMap(d => topLevelUnion(d.type.getText(d.getSourceFile()).replace(/\s+/g, " "))))].join(" | ")
          : declaration && ts.isPropertySignature(declaration) && declaration.type
          ? declaration.type.getText(declaration.getSourceFile()).replace(/\s+/g, " ") : checker.typeToString(checker.getNonNullableType(valueType));
        const at = declaration ?? statement;
        // The interface or type that declares it: a prop another component's props lend (Input's on Search field) is
        // that component's.
        let owner = declaration?.parent;
        while (owner && !ts.isInterfaceDeclaration(owner) && !ts.isTypeAliasDeclaration(owner)) owner = owner.parent;
        const tags = tagsOf(symbol);
        // "@deprecated `variant="field"`: …" retires one value, not the prop.
        const retired = /^`[\w-]+="([\w-]+)"`/.exec(tags.deprecated ?? "")?.[1];
        const doc = (docOf(symbol, checker) + when(symbol.name)).trim() + (retired ? ` Deprecated: ${tags.deprecated}` : "");
        props.push({
          name: symbol.name, type: written, literals: literalsOf(valueType), mapped: !declaration,
          owner: owner ? owner.name.text : statement.name.text,
          manifestTyped: !declaration || mentions(MANIFEST_TYPES, ts.isPropertySignature(declaration) ? declaration.type : undefined),
          narrowed: !!declaration && mentions(/\bExclude</, ts.isPropertySignature(declaration) ? declaration.type : undefined),
          aliases: (literalsOf(valueType) ?? []).filter(value => deprecatedValues.has(value)
            || value === retired || new RegExp(`["\`]${value}["\`][^.]*deprecated|deprecated[^.]*["\`]${value}["\`]`).test(doc)),
          boolean: !!(checker.getNonNullableType(valueType).flags & ts.TypeFlags.BooleanLike) || written === "boolean",
          optional: !!(symbol.flags & ts.SymbolFlags.Optional),
          default: tags.default, doc, deprecated: "deprecated" in tags && !retired ? tags.deprecated || "a deprecated alias" : undefined,
          file: at.getSourceFile().fileName.slice(dir.length + 1),
          line: at.getSourceFile().getLineAndCharacterOfPosition(at.getStart()).line + 1,
        });
      }
      out[statement.name.text.slice(0, -"Props".length)] = { file: sourceFile.fileName.slice(dir.length + 1), props, deprecated: !!ts.getJSDocDeprecatedTag(statement) };
    }
  }
  for (const [name, entry] of Object.entries(out)) {
    const written = defaults[`${name}Props`] ?? {};
    const falls = fallbacks[`${name}Props`] ?? new Set();
    for (const prop of entry.props) {
      prop.default ??= written[prop.name];
      // The code falls back for it, and no tag or form says to what.
      prop.unreadDefault = prop.default === undefined && falls.has(prop.name);
    }
  }
  return out;
}

/** The props whose code falls back to a default the generator cannot read (`a ?? "md"` on a prop with no `@default`):
 * "Name.prop (file:line)". Each wants `@default` in its JSDoc. */
export const unreadDefaults = (react = reactProps()) => Object.entries(react).flatMap(([name, entry]) => entry.props
  .filter(prop => prop.unreadDefault && prop.owner === `${name}Props`).map(prop => `${name}.${prop.name} (${prop.file}:${prop.line})`));

/* --- Manifests and pages ---------------------------------------------------------------------------------------- */

const fresh = path => `${pathToFileURL(path)}?v=${statSync(path).mtimeMs}`;
export const loadManifests = async (root = repo) => (await import(fresh(join(root, MANIFEST)))).MANIFESTS;
export const loadPages = async (root = repo) => (await import(fresh(join(root, PAGES)))).COMPONENT_PAGES;

const pascal = slug => slug.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join("");
/** The exports a page lists, the first being the family's own (as the app's importsOf: imports, exportName, the slug's name). */
export const exportsOfPage = (page, react = {}) => (page.imports ?? page.exportName ?? (pascal(page.slug) in react ? pascal(page.slug) : ""))
  .split(",").map(name => name.trim()).filter(Boolean);

/**
 * The parts each family's API tab lists: slug -> export names, the family's own export first, then its sub-parts (a
 * `*Props` no other family owns, named after the family's export (NavItem under Nav) or listed in the page's imports).
 * A companion a page imports for its examples (Button on Card) stays on its own family's tab.
 */
export function partsOfPages(pages, react) {
  const families = pages.filter(page => !page.docsOnly);
  const primary = new Map(families.map(page => [exportsOfPage(page, react)[0], page.slug]));
  const parts = new Map(families.map(page => [page.slug, [exportsOfPage(page, react)[0]].filter(Boolean)]));
  for (const name of Object.keys(react)) {
    // A deprecated component (Token, now Code's swatch) has no tab of its own to join.
    if (primary.has(name) || react[name].deprecated) continue;
    const listed = families.find(page => exportsOfPage(page, react).slice(1).includes(name));
    // NavItem under Nav; Toaster under Toast.
    const named = [...primary.keys()].filter(owner => owner && name.startsWith(owner) && name !== owner)
      .sort((a, b) => b.length - a.length)[0];
    // A singular part of a plural family (LinkGroup of LinkGroups) is that family's.
    const plural = [...primary.keys()].find(owner => owner && owner !== name && owner.startsWith(name));
    const slug = primary.get(plural) ?? primary.get(named) ?? listed?.slug;
    if (slug) parts.get(slug).push(name);
  }
  return parts;
}

/** The manifest an export draws: the page's for its first export, else one named after the export. */
export function manifestOfExport(page, name, index, manifests) {
  if (index === 0 && page.manifest) return manifests[page.manifest];
  return manifests[lowerFirst(name)] ?? (name === "Switch" ? manifests.switchControl : undefined);
}

/* --- Rows ------------------------------------------------------------------------------------------------------- */

const kebab = name => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const and = names => names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;

/**
 * The Area components an export's props extend (ComposerMic's Omit<ButtonProps, …>): lender -> its props this export
 * takes. Each is listed once, as "and every Button prop" linking the lender's family, not prop by prop; a borrowed prop
 * stays a row of its own only where this export changes it: an axis its own manifest draws, or a default of its own.
 */
function lent(name, entry, manifest, react, familyOf) {
  const out = new Map();
  for (const prop of entry.props) {
    const lender = prop.owner.endsWith("Props") ? prop.owner.slice(0, -"Props".length) : undefined;
    if (!lender || lender === name || !react[lender] || !familyOf.has(lender)) continue;
    const theirs = react[lender].props.find(other => other.name === prop.name);
    const lenderManifest = MANIFEST_OF.get(lender);
    const theirDefault = theirs?.default ?? (lenderManifest?.defaults[prop.name] !== undefined ? quote(lenderManifest.defaults[prop.name]) : undefined);
    if (manifest?.variants[prop.name] || (prop.default !== undefined && prop.default !== theirDefault)) continue;
    if (!out.has(lender)) out.set(lender, []);
    out.get(lender).push(prop.name);
  }
  return out;
}
/** Export name -> the manifest it draws (filled by familyRows from each page), for a lender's own defaults. */
const MANIFEST_OF = new Map();

/*
 * The order of a part's rows (system evaluation 2026-11-11, F5): what it looks like (its manifest's axes and flags, and
 * the visual words), then its content and slots, then its behaviour (GOVERNANCE § 4's behaviour API: a value, open,
 * disabled, a form's name), then its callbacks, and the deprecated last. Within a group, the source's order.
 */
const VISUAL_WORDS = new Set(["variant", "size", "tone", "layout", "kind", "orientation", "selection", "density", "side", "align", "color", "ink", "shape", "aspect"]);
const BEHAVIOUR_WORDS = /^(value|values|default[A-Z]\w*|open|checked|selected|disabled|readOnly|required|invalid|inactive|inactiveText|loading|loadingText|name|form|min|max|step|multiple|selectionMode|expanded|sort|hiddenKeys|view|minSize|maxSize|delay|activationMode|month|autoFocus|type|href|target|rel|as|modal|collapsed|glide|locale|today|isDateUnavailable|firstDayOfWeek|validationStatus|status|dirty|modified)$/;
export const ORDER = ["visual", "content", "behaviour", "callback", "deprecated"];
export function groupOf(prop, manifest, flags = new Map((manifest?.booleans ?? []).map(flag => [camel(flag), flag]))) {
  if (prop.deprecated) return "deprecated";
  if (/^on[A-Z]/.test(prop.name)) return "callback";
  if (manifest?.variants[prop.name] || flags.has(prop.name) || (VISUAL_WORDS.has(prop.name) && (prop.literals || prop.manifestTyped))) return "visual";
  if (BEHAVIOUR_WORDS.test(prop.name)) return "behaviour";
  return "content";
}

/** One export's rows: [prop, type, default, description]. */
function exportRows(entry, manifest, prefix, name = "", react = {}, familyOf = new Map()) {
  const flags = new Map((manifest?.booleans ?? []).map(flag => [camel(flag), flag]));
  const rows = [];
  const deprecated = [];
  // A controlled prop with its uncontrolled twin (open / defaultOpen) has no default: unset, the component keeps its own.
  const names = new Set(entry.props.map(prop => prop.name));
  const controlled = name => names.has(`default${name[0].toUpperCase()}${name.slice(1)}`);
  const lenders = lent(name, entry, manifest, react, familyOf);
  const borrowed = new Set([...lenders.values()].flat());
  const ordered = entry.props.map((prop, index) => ({ prop, index, group: ORDER.indexOf(groupOf(prop, manifest, flags)) }))
    .sort((a, b) => a.group - b.group || a.index - b.index).map(({ prop }) => prop);
  for (const prop of ordered) {
    if (borrowed.has(prop.name)) continue;
    const axis = manifest?.variants[prop.name];
    let type = prop.type;
    let fallback = prop.default;
    if (axis) {
      // The manifest is the source of a visual prop's values (those React takes: Chart leaves `number` to ChartNumber);
      // values React adds beyond it follow, as React types them (the parity test lists each).
      const accepted = prop.literals ? axis.filter(value => prop.literals.includes(value)) : axis;
      const extra = (prop.literals ?? []).filter(value => !axis.includes(value));
      type = [...accepted, ...extra].map(quote).join(" | ");
      fallback ??= manifest.defaults[prop.name] !== undefined ? quote(manifest.defaults[prop.name]) : undefined;
    } else if (prop.literals && prop.literals.length > 1 && /^[A-Z]\w*(\[[^\]]+\])?$/.test(type)) {
      type = prop.literals.map(quote).join(" | ");
    } else if (flags.has(prop.name) || prop.boolean) {
      type = "boolean";
      // Unset is its own value where the doc says so (a pill that follows the theme).
      fallback ??= prop.optional && !controlled(prop.name) ? (/^unset\b/i.test(prop.doc) ? "unset" : "false") : undefined;
    }
    const row = [`${prefix}${prop.name}`, type, fallback ?? "—", prop.deprecated ? `Deprecated: ${prop.deprecated}` : prop.doc];
    (prop.deprecated ? deprecated : rows).push(row);
  }
  // "and every Button prop": after its own, before the deprecated; the lender's props it leaves out are named.
  const every = [...lenders].map(([lender, taken]) => {
    const left = react[lender].props.filter(prop => !prop.deprecated && !taken.includes(prop.name) && !names.has(prop.name)).map(prop => `\`${prop.name}\``);
    return [`${prefix}...${lender}Props`, `${lender}Props`, "—",
      `And every [${lender}](${familyOf.get(lender)}.md) prop${left.length ? `, but ${and(left)}` : ""}.`];
  });
  return [...rows, ...every, ...deprecated];
}

/**
 * A hand row's prop names and the part they belong to: "Accordion: value / defaultValue", "MenuItem.tone",
 * "SliderRange min / max" -> { part, names }; "count / max" -> { names }.
 */
export function handNames(row, parts = []) {
  const [head = ""] = row;
  const match = /^([A-Z]\w*)(?::\s*|\.|\s+)(.+)$/.exec(head);
  const part = match && parts.includes(match[1]) ? match[1] : undefined;
  return { part, names: (part ? match[2] : head).split(/\s*[\/,]\s*/).map(name => name.trim()).filter(Boolean) };
}

/** Is a hand row restating props the generated rows already give? Every name it lists must be generated. */
export function restated(row, generated, parts) {
  const { part, names } = handNames(row, parts);
  const has = name => part ? generated.has(part === parts[0] ? name : `${part}: ${name}`)
    : generated.has(name) || parts.some(other => generated.has(`${other}: ${name}`));
  return names.length > 0 && names.every(has);
}

/**
 * A family's rows: its first export's props unprefixed, then each other export's as "Name: prop", then the hand rows
 * that say what neither source does. Returns { rows, generated: Set of row names, hand: kept hand rows, restated }.
 */
export function familyRows(page, react, manifests, parts = partsOfPages([page], react).get(page.slug), familyOf = familiesOfParts(new Map([[page.slug, parts]]), react)) {
  const rows = [];
  parts.forEach((name, index) => {
    const entry = react[name];
    if (!entry) return;
    rows.push(...exportRows(entry, manifestOfExport(page, name, index, manifests), index === 0 ? "" : `${name}: `, name, react, familyOf));
  });
  const generated = new Set(rows.map(row => row[0]));
  const hand = [];
  const repeated = [];
  for (const row of page.api ?? []) (restated(row, generated, parts) ? repeated : hand).push(row);
  return { rows: [...rows, ...hand.map(([prop, type, fallback]) => [prop, type, fallback ?? "—", ""])], generated, hand, restated: repeated };
}

/**
 * Export name -> the slug of the family whose tab lists it, for every family in `parts` (as partsOfPages gives); with
 * `pages` and `manifests`, it also learns the manifest each export draws, for a lender's defaults.
 */
export function familiesOfParts(parts, react, pages = [], manifests = {}) {
  const out = new Map();
  for (const [slug, names] of parts) names.forEach((name, index) => {
    out.set(name, slug);
    const page = pages.find(other => other.slug === slug);
    const manifest = page && manifestOfExport(page, name, index, manifests);
    if (manifest) MANIFEST_OF.set(name, manifest);
  });
  return out;
}

/** slug -> rows, for every page. */
export async function apiRows(root = repo) {
  const [react, manifests, pages] = [reactProps(root), await loadManifests(root), await loadPages(root)];
  const parts = partsOfPages(pages, react);
  const familyOf = familiesOfParts(parts, react, pages, manifests);
  return Object.fromEntries(pages.filter(page => !page.docsOnly).map(page => [page.slug, familyRows(page, react, manifests, parts.get(page.slug), familyOf).rows]));
}

/** The esbuild plugin: `import API_ROWS from "virtual:api-rows"`, read again only when a source changed. */
export const apiRowsPlugin = (root = repo) => {
  let cached;
  return {
    name: "api-rows",
    setup(build) {
      build.onResolve({ filter: /^virtual:api-rows$/ }, () => ({ path: "api-rows", namespace: "api-rows" }));
      build.onLoad({ filter: /.*/, namespace: "api-rows" }, async () => {
        const files = apiSourceFiles(root);
        const stamp = files.map(file => statSync(file).mtimeMs).join();
        if (cached?.stamp !== stamp) cached = { stamp, contents: JSON.stringify(await apiRows(root)) };
        return { contents: cached.contents, loader: "json", watchFiles: files };
      });
    },
  };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const all = await apiRows();
  for (const slug of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(all)) {
    console.log(`\n# ${slug}`);
    for (const row of all[slug] ?? []) console.log(`  ${row[0]}  ::  ${row[1]}  ::  ${row[2]}${row[3] ? `  ::  ${row[3]}` : ""}`);
  }
}
