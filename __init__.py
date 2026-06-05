from .ltx_keyframer import LTXKeyframer
from .multi_image_loader import MultiImageLoader
from .ltx_sequencer import LTXSequencer
from .speech_length_calculator import SpeechLengthCalculator
from .load_audio_ui import LoadAudioUI
from .load_video_ui import LoadVideoUI
from .ltx_director import LTXDirector
from .ltx_director_guide import LTXDirectorGuide
from comfy_api.latest import ComfyExtension, io
from typing_extensions import override

class YusuWhatDreamsCostExtension(ComfyExtension):
    @override
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [
            LTXDirector,
            LTXDirectorGuide
        ]

async def comfy_entrypoint() -> YusuWhatDreamsCostExtension:
    return YusuWhatDreamsCostExtension()
    
NODE_CLASS_MAPPINGS = {
    "Yusu-LTXKeyframer": LTXKeyframer,
    "Yusu-MultiImageLoader": MultiImageLoader,
    "Yusu-LTXSequencer": LTXSequencer,
    "Yusu-SpeechLengthCalculator": SpeechLengthCalculator,
    "Yusu-LoadAudioUI": LoadAudioUI,
    "Yusu-LoadVideoUI": LoadVideoUI,
    "Yusu-LTXDirector": LTXDirector,
    "Yusu-LTXDirectorGuide": LTXDirectorGuide,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "Yusu-LTXKeyframer": "Yusu LTX Keyframer",
    "Yusu-MultiImageLoader": "Yusu Multi Image Loader",
    "Yusu-LTXSequencer": "Yusu LTX Sequencer",
    "Yusu-SpeechLengthCalculator": "Yusu Speech Length Calculator",
    "Yusu-LoadAudioUI": "Yusu Load Audio UI",
    "Yusu-LoadVideoUI": "Yusu Load Video UI",
    "Yusu-LTXDirector": "Yusu LTX Director",
    "Yusu-LTXDirectorGuide": "Yusu LTX Director Guide",
}

WEB_DIRECTORY = "./js"

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']
