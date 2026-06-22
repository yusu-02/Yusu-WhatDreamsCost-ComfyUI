import importlib.util
from pathlib import Path


def load_prompt_relay():
    path = Path(__file__).resolve().parents[1] / "prompt_relay.py"
    spec = importlib.util.spec_from_file_location("prompt_relay", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_transition_smoothness_expands_segment_window():
    mod = load_prompt_relay()
    hard = mod.build_segments([(0, 2)], [40], 1e-3, {"transition_smoothness": [0]})[0]
    smooth = mod.build_segments([(0, 2)], [40], 1e-3, {"transition_smoothness": [1]})[0]

    assert smooth["window"] > hard["window"]
    assert smooth["sigma"] > hard["sigma"]
