import ast
from pathlib import Path


source = Path(__file__).resolve().parents[1] / "ltx_director_guide.py"
tree = ast.parse(source.read_text(encoding="utf-8"))
funcs = {
    node.name: ast.unparse(node)
    for node in tree.body
    if isinstance(node, ast.FunctionDef) and node.name == "_resolve_crop_frames"
}
ns = {}
exec(funcs["_resolve_crop_frames"], ns)


resolve = ns["_resolve_crop_frames"]

assert resolve(latent_frame_count=45, requested_crop_frames=1, original_latent_frames=45) == 0
assert resolve(latent_frame_count=46, requested_crop_frames=1, original_latent_frames=45) == 1
assert resolve(latent_frame_count=47, requested_crop_frames=4, original_latent_frames=45) == 2
assert resolve(latent_frame_count=45, requested_crop_frames=1, original_latent_frames=None) == 1
