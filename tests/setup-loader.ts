import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./tests/tsx-hooks.ts", pathToFileURL("./"));
