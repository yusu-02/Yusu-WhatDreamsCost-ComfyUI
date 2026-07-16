import ast
from pathlib import Path

import torch


source = Path(__file__).resolve().parents[1] / "ltx_director.py"
tree = ast.parse(source.read_text(encoding="utf-8"))
functions = {
    node.name: node
    for node in tree.body
    if isinstance(node, ast.FunctionDef)
    and node.name in {"_append_ic_lora_frames", "_has_manual_ic_segment"}
}
ns = {"torch": torch}
exec(compile(ast.Module(body=list(functions.values()), type_ignores=[]), str(source), "exec"), ns)

data = {"segments": []}
frames = torch.zeros((41, 64, 64, 3))
segment = {"start": 8, "length": 24, "trimStart": 4}
ns["_append_ic_lora_frames"](data, frames, 16, 16, segment)

assert len(data["segments"]) == 1
assert data["segments"][0]["start"] == 0
assert data["segments"][0]["trimStart"] == 12
assert data["segments"][0]["length"] == 16
assert data["segments"][0]["videoFrames"].shape == (16, 64, 64, 3)

assert not ns["_has_manual_ic_segment"]({"motionSegments": [{"linkedICFrames": True}]})
assert ns["_has_manual_ic_segment"]({
    "motionSegments": [{"type": "motion_video", "videoFile": "manual.mp4"}]
})
