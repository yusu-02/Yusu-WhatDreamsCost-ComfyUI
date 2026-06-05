import importlib.util
import unittest
from pathlib import Path


def load_prompt_relay():
    module_path = Path(__file__).resolve().parents[1] / "prompt_relay.py"
    spec = importlib.util.spec_from_file_location("test_prompt_relay", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class SegmentLengthValidationTests(unittest.TestCase):
    def test_distributes_segments_when_video_is_long_enough(self):
        prompt_relay = load_prompt_relay()

        self.assertEqual(
            prompt_relay.distribute_segment_lengths(
                num_segments=3,
                latent_frames=6,
            ),
            [2, 2, 2],
        )

    def test_rejects_more_segments_than_latent_frames(self):
        prompt_relay = load_prompt_relay()

        with self.assertRaisesRegex(ValueError, "Increase the video duration"):
            prompt_relay.distribute_segment_lengths(
                num_segments=3,
                latent_frames=2,
                specified_lengths=[1, 1, 0],
            )


if __name__ == "__main__":
    unittest.main()
