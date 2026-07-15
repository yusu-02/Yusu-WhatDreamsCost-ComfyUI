import ast
from pathlib import Path


source = Path(__file__).resolve().parents[1] / "ltx_director.py"
tree = ast.parse(source.read_text(encoding="utf-8"))
funcs = {
    node.name: ast.unparse(node)
    for node in tree.body
    if isinstance(node, ast.FunctionDef) and (
        node.name.startswith("_ltxv_")
        or node.name in {"_dummy_guide_source_dimensions", "_resolve_output_base_dimensions", "_fit_latent_time"}
    )
}
ns = {"math": __import__("math"), "torch": __import__("torch")}
exec(funcs["_ltxv_pixel_frames"], ns)
exec(funcs["_ltxv_latent_frames"], ns)
exec(funcs["_fit_latent_time"], ns)
exec(funcs["_dummy_guide_source_dimensions"], ns)
exec(funcs["_resolve_output_base_dimensions"], ns)


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
assert ns["_resolve_output_base_dimensions"](832, 480, False, False, (1280, 720)) == (832, 480)
assert ns["_resolve_output_base_dimensions"](832, 480, True, False, (1280, 720)) == (1280, 720)
assert ns["_resolve_output_base_dimensions"](832, 480, True, True, (1280, 720)) == (832, 480)

torch = ns["torch"]
short = {"samples": torch.ones(1, 128, 18, 2, 2), "noise_mask": torch.zeros(1, 1, 18, 1, 1)}
fitted = ns["_fit_latent_time"](short, 31)
assert fitted["samples"].shape[2] == 31
assert fitted["noise_mask"].shape[2] == 31
assert torch.all(fitted["samples"][:, :, :18] == 1)
assert torch.all(fitted["samples"][:, :, 18:] == 0)
assert torch.all(fitted["noise_mask"][:, :, 18:] == 1)
