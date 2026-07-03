import ast
from pathlib import Path


source = Path(__file__).resolve().parents[1] / "ltx_director.py"
tree = ast.parse(source.read_text(encoding="utf-8"))
funcs = {
    node.name: ast.unparse(node)
    for node in tree.body
    if isinstance(node, ast.FunctionDef) and (node.name.startswith("_ltxv_") or node.name == "_dummy_guide_source_dimensions")
}
ns = {"math": __import__("math")}
exec(funcs["_ltxv_pixel_frames"], ns)
exec(funcs["_ltxv_latent_frames"], ns)
exec(funcs["_dummy_guide_source_dimensions"], ns)


assert ns["_ltxv_pixel_frames"](1) == 9
assert ns["_ltxv_pixel_frames"](8) == 9
assert ns["_ltxv_latent_frames"](9) == 2
assert ns["_ltxv_pixel_frames"](149) == 153
assert ns["_ltxv_latent_frames"](153) == 20
assert (ns["_ltxv_latent_frames"](153) - 1) * 8 + 1 == 153
assert ns["_ltxv_pixel_frames"](360) == 361
assert ns["_ltxv_latent_frames"](361) == 46
assert (ns["_ltxv_latent_frames"](361) - 1) * 8 + 1 == 361
assert ns["_dummy_guide_source_dimensions"]() == (768, 512)
assert ns["_dummy_guide_source_dimensions"](832, 480) == (832, 480)
