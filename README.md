# Yusu-WhatDreamsCost-ComfyUI

This project is based on [WhatDreamsCost/WhatDreamsCost-ComfyUI](https://github.com/WhatDreamsCost/WhatDreamsCost-ComfyUI).

The original project and its original features were created by WhatDreamsCost. This fork keeps the original GPL-3.0 license and uses an independent Yusu node namespace, so it can be installed alongside the original plugin without overwriting the original node IDs.

## Main Changes

- Added timeline import, placement, and sync controls for images, audio, video, and IC video segments.
- Added automatic total-duration matching based on the latest end time of image, audio, and video segments.
- Added manual duration input for image, audio, and video segments.
- Added playhead-based cutting for audio and video segments, with the cut control placed beside the Duration control.
- Added alignment controls so image segments can be synced with audio, visual segments, or video segments.
- Fixed timeline state restoration issues after switching canvases.
- Fixed LTXV frame alignment math to avoid generating an extra duration block.
- Improved the custom audio pipeline: automatic custom-audio enabling, mix peak protection, and audio reference token injection into conditioning.
- Kept the original base node functionality while moving node IDs into the independent Yusu namespace.

## Version 2.0.1

Released: 2026-07-02

### Added

- Added a `Manual Range: ON/OFF` switch so users can choose whether the output start, end, and duration are controlled manually or automatically synced from timeline segments.
- Added playhead right-click actions: `Set Start at Playhead` and `Set End at Playhead`.
- Added single-segment and multi-selection output range actions, so selected image, text, audio, or video segments can define the output start/end range.
- Added audio shrink behavior that keeps the trimmed tail on the timeline instead of deleting it, making it easier to reuse other parts of the same audio file.
- Improved the right-click menu: it now stays inside the viewport, scrolls when too tall, hides unavailable paste actions, and uses clearer labels such as `Copy Timeline Segment` and `Copy Image to Clipboard`.

### Fixed

- Fixed right-click fitting for text segments, so text can now be aligned with audio, visual, and IC video segments.
- Fixed fitted image/text segments covering other main-track segments by pushing overlapping segments forward.
- Fixed duration shrink edits leaving unwanted gaps by pulling later image/text segments forward where appropriate.
- Fixed timeline playback bounds so the playhead and seek bar follow the real media duration instead of the visual padding area.
- Fixed IC-LoRA reference videos incorrectly controlling the output canvas size. Director output now follows the LTX Director custom width and height settings.
- Fixed old non-zero `transition_smoothness` values from affecting generation after the Transition UI was removed.

### Removed

- Removed the bottom `Transition` control from LTX Director because it added UI weight without being useful in the current workflow.
- Removed obsolete full-audio restore/add-at-playhead context-menu actions.
- Removed noisy debug logging from the Director timeline editor.

## Node Namespace

This fork registers the following Yusu node IDs:

- `YusuLTXDirector`
- `YusuLTXDirectorGuide`
- `YusuLTXDirectorCropGuides`
- `YusuLTXSequencer`
- `YusuLTXKeyframer`
- `YusuMultiImageLoader`
- `YusuSpeechLengthCalculator`
- `YusuLoadAudioUI`
- `YusuLoadVideoUI`

The node category is:

```text
Yusu/WhatDreamsCost
```

## Installation

Go to your ComfyUI `custom_nodes` directory:

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/yusu-02/Yusu-WhatDreamsCost-ComfyUI
```

Restart ComfyUI and force-refresh the browser page.

This fork uses the same core dependencies as the original project. It is recommended to update:

- ComfyUI-LTXVideo
- ComfyUI-KJNodes

## License

This project keeps the original GPL-3.0 license from WhatDreamsCost-ComfyUI.
