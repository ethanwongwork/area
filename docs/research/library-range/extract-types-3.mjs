import ts from "typescript";
import fs from "node:fs";

const files = JSON.parse(fs.readFileSync(0, "utf8"));
const result = {};
const skip = new Set(["children", "className", "classNames", "style", "styles", "ref", "id", "name", "key", "as", "asChild", "render", "component", "testId", "unstyled", "vars", "attributes", "locale", "dir", "analyticsContext", "testID"]);
for (const path of files) {
  const source = ts.createSourceFile(path, fs.readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
  const rows = [];
  function add(node, name, values, kind, owner) {
    if (!name || skip.has(name) || name.startsWith("on") || name.startsWith("aria-") || name.includes("SECRET") || values.length > 350 || values.includes("=>") || values.includes("SECRET")) return;
    rows.push({name, values: values.replace(/\s+/g, " ").trim(), kind, owner,
      line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
      end: source.getLineAndCharacterOfPosition(node.getEnd()).line + 1});
  }
  function visit(node) {
    if (ts.isPropertySignature(node) && node.type) {
      let parent = node.parent;
      while (parent && !ts.isInterfaceDeclaration(parent) && !ts.isTypeAliasDeclaration(parent)) parent = parent.parent;
      const owner = parent?.name?.text || "anonymous type";
      const value = node.type.getText(source);
      const name = node.name.getText(source).replace(/^['"]|['"]$/g, "");
      if (!/CssVariables|CSSProperties|Factory|Config|Options|Internal|Context/.test(owner) && !value.includes("--")) {
        const kind = /Slots/.test(owner) || /ReactNode|Slot</.test(value) ? "slot" : /State|RenderProps/.test(owner) ? "runtime-state" : "prop";
        add(node, name, value, kind, owner);
      }
    }
    if (ts.isTypeAliasDeclaration(node) && ts.isUnionTypeNode(node.type) && node.type.types.every(t => ts.isLiteralTypeNode(t))) {
      if (!/StylesNames|CssVariables|Event|Reason|Action/.test(node.name.text)) add(node, node.name.text, node.type.getText(source), "enum", node.name.text);
    }
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isAsExpression(node.initializer) && ts.isArrayLiteralExpression(node.initializer.expression) && node.initializer.expression.elements.every(ts.isStringLiteral)) {
      add(node, node.name.getText(source), node.initializer.expression.getText(source), "enum", "literal option set");
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  result[path] = rows;
}
process.stdout.write(JSON.stringify(result));
