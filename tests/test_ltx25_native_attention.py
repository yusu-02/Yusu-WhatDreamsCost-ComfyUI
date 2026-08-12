import ast
from pathlib import Path


source = Path(__file__).resolve().parents[1] / "patches.py"
tree = ast.parse(source.read_text(encoding="utf-8"))
func = next(
    node for node in tree.body
    if isinstance(node, ast.FunctionDef) and node.name == "_ltx_forward"
)
ns = {}
exec(ast.unparse(func), ns)

received = {}


def original_forward(x, **kwargs):
    received.update(kwargs)
    return "native-result"


def mask_fn(q, k, transformer_options):
    assert (q, k) == ("video", "text")
    assert transformer_options == {"ltx25": True}
    return 3


result = ns["_ltx_forward"](
    original_forward,
    mask_fn,
    "video",
    context="text",
    mask=2,
    pe="video-rope",
    k_pe="text-rope",
    transformer_options={"ltx25": True},
)

assert result == "native-result"
assert received == {
    "context": "text",
    "mask": 5,
    "pe": "video-rope",
    "k_pe": "text-rope",
    "transformer_options": {"ltx25": True},
}
