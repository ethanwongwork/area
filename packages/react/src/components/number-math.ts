/** A bounded arithmetic grammar for numeric fields. No identifiers, calls or code execution. */
export function calculateNumber(text: string, current = 0, decimal = ".", group = ","): number | null {
  let source = text.trim();
  if (!source || source.length > 80) return null;
  if (group && group !== decimal) source = source.split(group).join("");
  if (decimal !== ".") source = source.split(decimal).join(".");
  // A leading binary operator is relative to the committed value (Figma-style entry).
  if (/^[+*/]/.test(source)) source = `${current}${source}`;
  if (!/^[\d\s.+*/()\-]+$/.test(source)) return null;
  let index = 0;
  let operations = 0;
  const skip = () => { while (source[index] === " ") index++; };
  const factor = (depth: number): number => {
    if (depth > 8 || ++operations > 64) return NaN;
    skip();
    const sign = source[index] === "-" ? -1 : 1;
    if (source[index] === "-" || source[index] === "+") index++;
    skip();
    if (source[index] === "(") {
      index++;
      const value = sum(depth + 1);
      skip();
      if (source[index++] !== ")") return NaN;
      return sign * value;
    }
    const match = /^(?:\d+(?:\.\d*)?|\.\d+)/.exec(source.slice(index));
    if (!match) return NaN;
    index += match[0].length;
    return sign * Number(match[0]);
  };
  const product = (depth: number): number => {
    let value = factor(depth);
    for (;;) {
      skip();
      const operator = source[index];
      if (operator !== "*" && operator !== "/") return value;
      index++;
      const operand = factor(depth);
      value = operator === "*" ? value * operand : value / operand;
    }
  };
  const sum = (depth: number): number => {
    let value = product(depth);
    for (;;) {
      skip();
      const operator = source[index];
      if (operator !== "+" && operator !== "-") return value;
      index++;
      const operand = product(depth);
      value = operator === "+" ? value + operand : value - operand;
    }
  };
  const result = sum(0);
  skip();
  return index === source.length && Number.isFinite(result) ? result : null;
}

export function clampNumber(value: number, min?: number, max?: number): number {
  return Math.min(max ?? Infinity, Math.max(min ?? -Infinity, value));
}

export function steppedNumber(value: number, delta: number, step: number, min?: number, max?: number): number {
  const precision = Math.min(10, Math.max(...[value, step, min ?? 0].map(number => (String(number).split(".")[1] ?? "").length)));
  return clampNumber(Number((value + delta * step).toFixed(precision)), min, max);
}
