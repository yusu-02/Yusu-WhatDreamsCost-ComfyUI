import ast
from pathlib import Path


class NodeHelpers:
    @staticmethod
    def conditioning_set_values(conditioning, values):
        return [[t[0], {**t[1], **values}] for t in conditioning]


class FakeTensor:
    def __init__(self, shape):
        self.shape = shape

    def permute(self, *order):
        return FakeTensor(tuple(self.shape[i] for i in order))

    def reshape(self, *shape):
        return FakeTensor(shape)


source = Path(__file__).resolve().parents[1] / "ltx_director.py"
tree = ast.parse(source.read_text(encoding="utf-8"))
func = next(
    node for node in tree.body
    if isinstance(node, ast.FunctionDef) and node.name == "_add_audio_ref_tokens"
)
ns = {"node_helpers": NodeHelpers}
exec(ast.unparse(func), ns)

cond = [[None, {"keep": True}]]
audio_latent = FakeTensor((1, 3, 5, 7))
out = ns["_add_audio_ref_tokens"](cond, audio_latent)

assert out[0][1]["keep"] is True
assert out[0][1]["ref_audio"]["tokens"].shape == (1, 5, 21)
