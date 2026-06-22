import ast
from pathlib import Path


source = Path(__file__).resolve().parents[1] / "ltx_director.py"
tree = ast.parse(source.read_text(encoding="utf-8"))
funcs = {
    node.name: ast.unparse(node)
    for node in tree.body
    if isinstance(node, ast.FunctionDef) and node.name.startswith("_ltxv_")
}
ns = {"math": __import__("math")}
exec(funcs["_ltxv_pixel_frames"], ns)
exec(funcs["_ltxv_latent_frames"], ns)


assert ns["_ltxv_pixel_frames"](1) == 9
assert ns["_ltxv_pixel_frames"](8) == 9
assert ns["_ltxv_latent_frames"](9) == 1
assert ns["_ltxv_pixel_frames"](149) == 153
assert ns["_ltxv_latent_frames"](153) == 19
assert ns["_ltxv_latent_frames"](153) * 8 + 1 == 153
