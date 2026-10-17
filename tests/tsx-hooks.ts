import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { transformSync } from "esbuild";

export async function resolve(
  specifier: string,
  context: { parentURL?: string; conditions?: string[] },
  nextResolve: (spec: string, ctx: any) => Promise<any>
) {
  if (specifier.startsWith("@/")) {
    const resolved = new URL(`../src/${specifier.slice(2)}`, import.meta.url).href;
    return nextResolve(resolved, context);
  }
  return nextResolve(specifier, context);
}

export async function load(
  url: string,
  context: { format?: string; conditions?: string[] },
  nextLoad: (u: string, ctx: any) => Promise<any>
) {
  if (url.endsWith(".tsx")) {
    const filePath = fileURLToPath(url);
    const raw = readFileSync(filePath, "utf8");
    const transformed = transformSync(raw, {
      loader: "tsx",
      format: "esm",
      target: "es2022",
      jsx: "automatic",
      sourcemap: "inline",
      sourcefile: filePath,
    });
    return {
      format: "module",
      shortCircuit: true,
      source: transformed.code,
    };
  }
  return nextLoad(url, context);
}
