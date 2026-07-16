import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../js/ltx_director.js", import.meta.url), "utf8");

test("inactive director instances avoid high-frequency global work", () => {
  assert.match(source, /setTimeout\(\(\) => this\.checkResize\(\), 200\)/);
  assert.match(source, /window\.removeEventListener\("mousemove", this\._windowMouseMove\)/);
  assert.doesNotMatch(source, /window\.addEventListener\("mousemove", \(e\) => this\.onMouseMove\(e\)\)/);
});

test("timeline drag work is coalesced to one animation frame", () => {
  assert.match(source, /if \(!this\.container\?\.isConnected\) return/);
  assert.match(source, /if \(this\._mouseMoveFrame\) return/);
  assert.match(source, /this\._mouseMoveFrame = requestAnimationFrame/);
  assert.match(source, /cancelAnimationFrame\(this\._mouseMoveFrame\)/);
  assert.match(source, /if \(this\._pendingMouseMoveEvent\)/);
});

test("timeline drag avoids rebuilding the full property panel every frame", () => {
  assert.match(source, /this\.updateDragReadout\(t\.find/);
  assert.doesNotMatch(source, /this\.updateUIFromSelection\(\); \/\/ Live update of trim values/);
  assert.match(source, /const originalsById = new Map/);
});
