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

## Version 2.0.4

Released: 2026-08-12

### Fixed

- Added LTX 2.5 compatibility to Prompt Relay. The plugin now injects its temporal mask and delegates attention to ComfyUI's native LTX implementation, preserving model-specific behavior added by newer LTX releases.
- Added a clear error when a MiniMax H3 Audio VAE is connected to LTX Director; use the matching LTX audio VAE instead.
- Added a clear error when an LTX 2.5 model is paired with the old LTX 2.3 Gemma3 text encoder; use the matching Gemma4 encoder with projection.

### Compatibility

- LTX 2.5 requires ComfyUI `0.32.0` or newer and the latest `ComfyUI-LTXVideo`. LTX 2.3 workflows keep the existing ComfyUI `0.3.48` minimum.

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

## Version 2.0.2

Released: 2026-07-15

### Added

- Added IC-LoRA image segment support on the IC track, including toolbar upload, drag-and-drop, and gap-menu insertion.
- Added a small regression test for IC-LoRA image file detection.

### Improved

- Optimized image, audio, video, and IC video imports so timeline segments appear immediately while upload/decoding continues in the background.
- Optimized Prompt Relay for single-prompt timelines by bypassing attention masking and reusing patched model clones per node.
- Improved IC video loading by using metadata-first loading, reducing the wait before clips appear on the timeline.

### Fixed

- Fixed newly inserted main-track images covering later images/text/video segments by restoring insertion physics in the fast upload path.
- Fixed the first main-track image drop not snapping to frame 0 when the track is empty.
- Fixed IC-LoRA image segments being treated as videos by the guide node.
- Fixed static IC-LoRA images being sent through video scrubbing, thumbnail extraction, and motion-audio preview paths.
- Fixed optional latent time alignment by cropping or padding connected latents to the Director target frame count.
- Updated `YusuSpeechLengthCalculator` so dialogue length detection only reads text inside double quotes and Chinese double quotes.

## Version 2.0.3

Released: 2026-07-16

### Added

- Added an optional `IC-LoRA Video` IMAGE input to `Yusu LTX Director`, allowing frame batches from standard video loader nodes to be used directly as IC-LoRA motion guidance.
- Added a linked IC timeline segment for connected frame batches. Manually imported IC clips take priority, and the connected input is restored automatically after manual clips are removed.

### Improved

- Improved timeline dragging performance for image, text, audio, video, and IC segments by coalescing mouse movement to one update per animation frame.
- Reduced drag-time DOM work by updating only segment start, end, and duration readouts until the drag is committed.
- Reduced workflow-switch overhead by cleaning up inactive listeners, media elements, thumbnail caches, audio buffers, and resize polling.

### Fixed

- Fixed connected IC frame batches not reaching the Director Guide motion encoding path.
- Fixed failed manual IC uploads incorrectly suppressing a connected IC input.
- Fixed `IC Size` selection priority so a valid manual IC clip takes precedence over connected frame dimensions.
- Fixed Prompt Relay compatibility with newer `ComfyUI-KJNodes` LTX2 NAG mask callbacks, supporting both the original 3-argument call and the newer 5-argument call.
- Fixed legacy workflow widget migration across historical 19/21/22/23-field layouts, preventing raw Director widgets, shifted values, and invalid `NaN` parameters.
- Restored the `IC-LoRA Video` input automatically when loading workflows saved before that input existed.

### Compatibility

- Declared ComfyUI `v0.3.48` as the minimum supported version because the plugin uses `comfy_api.latest`.

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
