from .ltx_keyframer import LTXKeyframer
from .multi_image_loader import MultiImageLoader
from .ltx_sequencer import LTXSequencer
from .speech_length_calculator import SpeechLengthCalculator
from .load_audio_ui import LoadAudioUI
from .load_video_ui import LoadVideoUI
from .ltx_director import LTXDirector
from .ltx_director_guide import LTXDirectorGuide, LTXDirectorCropGuides
from comfy_api.latest import ComfyExtension, io
from typing_extensions import override

class PromptRelay(ComfyExtension):
    @override
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [
            LTXDirector,
            LTXDirectorGuide
        ]

async def comfy_entrypoint() -> PromptRelay:
    return PromptRelay()
    
NODE_CLASS_MAPPINGS = {
    "YusuLTXKeyframer": LTXKeyframer,
    "YusuMultiImageLoader": MultiImageLoader,
    "YusuLTXSequencer": LTXSequencer,
    "YusuSpeechLengthCalculator": SpeechLengthCalculator,
    "YusuLoadAudioUI": LoadAudioUI,
    "YusuLoadVideoUI": LoadVideoUI,
    "YusuLTXDirector": LTXDirector,
    "YusuLTXDirectorGuide": LTXDirectorGuide,
    "YusuLTXDirectorCropGuides": LTXDirectorCropGuides,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "YusuLTXKeyframer": "Yusu LTX Keyframer",
    "YusuMultiImageLoader": "Yusu Multi Image Loader",
    "YusuLTXSequencer": "Yusu LTX Sequencer",
    "YusuSpeechLengthCalculator": "Yusu Speech Length Calculator",
    "YusuLoadAudioUI": "Yusu Load Audio UI",
    "YusuLoadVideoUI": "Yusu Load Video UI",
    "YusuLTXDirector": "Yusu LTX Director",
    "YusuLTXDirectorGuide": "Yusu LTX Director Guide",
    "YusuLTXDirectorCropGuides": "Yusu LTX Director Crop Guides",
}

WEB_DIRECTORY = "./js"

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']
