import { test } from "node:test";
import assert from "node:assert/strict";

import {
  transformFigmaToDTCG,
  mergeManagedGroup,
  type FigmaVariablesResponse,
  type FigmaVariable,
  type DTCGTree,
} from "./figma-to-dtcg.ts";

function variable(
  id: string,
  name: string,
  collectionId: string,
  resolvedType: FigmaVariable["resolvedType"],
  value: FigmaVariable["valuesByMode"][string],
): FigmaVariable {
  return {
    id,
    name,
    resolvedType,
    variableCollectionId: collectionId,
    valuesByMode: { m1: value },
    description: undefined,
    scopes: undefined,
    hiddenFromPublishing: undefined,
  };
}

const response: FigmaVariablesResponse = {
  meta: {
    variableCollections: {
      dim: { id: "dim", name: "Bordes y espaciado", modes: [{ id: "m1", name: "Default" }], defaultModeId: "m1" },
      sem: { id: "sem", name: "Semantic", modes: [{ id: "m1", name: "Default" }], defaultModeId: "m1" },
    },
    variables: {
      xs: variable("xs", "XS", "dim", "FLOAT", 4),
      xxl: variable("xxl", "XXL", "dim", "FLOAT", 36),
      gap: variable("gap", "Layout/Gap", "sem", "FLOAT", { type: "VARIABLE_ALIAS", id: "xs" }),
      brand: variable("brand", "Brand/Primary", "sem", "COLOR", { r: 1, g: 0, b: 0, a: 1 }),
    },
  },
};

function outputFor(fileName: string) {
  const out = transformFigmaToDTCG(response).find((o) => o.fileName === fileName);
  assert.ok(out, `missing output ${fileName}`);
  return out;
}

test("dimension collection is nested under size with lowercase px dimensions", () => {
  const out = outputFor("dimension.tokens.json");
  assert.equal(out.managedGroup, "size");
  assert.deepEqual(out.tree, {
    size: {
      xs: { $type: "dimension", $value: "4px" },
      xxl: { $type: "dimension", $value: "36px" },
    },
  });
});

test("aliases into the dimension collection use the size path", () => {
  const tree = outputFor("semantic.tokens.json").tree as Record<string, DTCGTree>;
  assert.deepEqual(tree["Layout"]?.["Gap"], { $type: "number", $value: "{size.xs}" });
});

test("collections without a shape keep Figma names untouched", () => {
  const out = outputFor("semantic.tokens.json");
  assert.equal(out.managedGroup, undefined);
  assert.deepEqual((out.tree as Record<string, DTCGTree>)["Brand"]?.["Primary"], { $type: "color", $value: "#ff0000" });
});

test("mergeManagedGroup replaces only the managed group and keeps hand-authored groups", () => {
  const existing: DTCGTree = {
    size: { xs: { $value: "2px" }, old: { $value: "1px" } },
    grid: { mobile: { columns: { $type: "number", $value: 4 } } },
  };
  const fresh: DTCGTree = { size: { xs: { $value: "4px" } } };
  assert.deepEqual(mergeManagedGroup(existing, fresh, "size"), {
    size: { xs: { $value: "4px" } },
    grid: { mobile: { columns: { $type: "number", $value: 4 } } },
  });
  assert.equal(mergeManagedGroup(existing, fresh, undefined), fresh);
  assert.equal(mergeManagedGroup(null, fresh, "size"), fresh);
});
