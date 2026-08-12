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
validator = next(
    node for node in tree.body
    if isinstance(node, ast.FunctionDef) and node.name == "_get_ltx_audio_vae_inner"
)
text_encoder_validator = next(
    node for node in tree.body
    if isinstance(node, ast.FunctionDef) and node.name == "_validate_ltx_text_encoder"
)
ns = {"node_helpers": NodeHelpers}
exec(ast.unparse(func), ns)
exec(ast.unparse(validator), ns)
exec(ast.unparse(text_encoder_validator), ns)

cond = [[None, {"keep": True}]]
audio_latent = FakeTensor((1, 3, 5, 7))
out = ns["_add_audio_ref_tokens"](cond, audio_latent)

assert out[0][1]["keep"] is True
assert out[0][1]["ref_audio"]["tokens"].shape == (1, 5, 21)


class LTXAudioVAE:
    latent_frequency_bins = 16

    def num_of_latents_from_frames(self, frames, fps):
        return round(frames / fps * 25)


class MiniMaxH3AudioVAE:
    pass


ltx = LTXAudioVAE()
assert ns["_get_ltx_audio_vae_inner"](ltx) is ltx

try:
    ns["_get_ltx_audio_vae_inner"](MiniMaxH3AudioVAE())
except ValueError as error:
    assert "ltx-2.5-audio-vae-bf16.safetensors" in str(error)
else:
    raise AssertionError("MiniMax H3 Audio VAE should be rejected")


class Obj:
    pass


model = Obj()
model.model = Obj()
model.model.diffusion_model = Obj()
model.model.diffusion_model.use_keyframes_abs_pos_embedding = True
clip = Obj()
clip.cond_stage_model = Obj()
clip.cond_stage_model.text_encoder_key = "gemma3_12b"

try:
    ns["_validate_ltx_text_encoder"](model, clip)
except ValueError as error:
    assert "gemma4-12b-with-proj-ltx-2.5" in str(error)
else:
    raise AssertionError("LTX 2.5 with Gemma3 should be rejected")

clip.cond_stage_model.text_encoder_key = "gemma4"
assert ns["_validate_ltx_text_encoder"](model, clip) is None
