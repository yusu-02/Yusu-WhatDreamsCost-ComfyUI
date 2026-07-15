import ast
from pathlib import Path


source = Path(__file__).resolve().parents[1] / "ltx_director_guide.py"
tree = ast.parse(source.read_text(encoding="utf-8"))
fn = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == "_is_image_file")
ns = {}
exec(compile(ast.Module(body=[fn], type_ignores=[]), str(source), "exec"), ns)

assert ns["_is_image_file"]("ref.png")
assert ns["_is_image_file"]("whatdreamscost/ref.WEBP")
assert not ns["_is_image_file"]("clip.mp4")
