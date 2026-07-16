import sys
from pathlib import Path

import torch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from prompt_relay import create_mask_fn


segments = [{
    "local_token_idx": torch.tensor([0, 1]),
    "midpoint": 1,
    "window": 0,
    "sigma": 1.0,
}]
mask_fn = create_mask_fn(segments, fallback_tokens_per_frame=2, latent_frames=2)

q = torch.zeros((1, 4, 8))
k = torch.zeros((1, 6, 8))
old_style = mask_fn(q, k, {})
keyword_style = mask_fn(q, k, transformer_options={})
kj_style = mask_fn(4, 6, q.dtype, q.device, {})

assert old_style.shape == (4, 6)
assert torch.equal(old_style, keyword_style)
assert torch.equal(old_style, kj_style)
assert mask_fn(4, 4, q.dtype, q.device, {}) is None
assert mask_fn(q, k, {"cond_or_uncond": [1]}) is None
assert mask_fn(4, 6, q.dtype, q.device, {"cond_or_uncond": [1]}) is None
