from __future__ import annotations

import math
import subprocess
from dataclasses import dataclass
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "assets"
HERO_DIR = PUBLIC / "hero"
JOURNEY_DIR = PUBLIC / "journey"
TMP_DIR = ROOT / "tmp-media-build"

SRC_OPEN_BOTTLE = PUBLIC / "stock" / "originals" / "ahimsa-brown-frosted.jpg"
SRC_CLOSED_BOTTLE = PUBLIC / "stock" / "originals" / "ahimsa-artistic-bottle.jpg"
SRC_SPRAY = ROOT / "tmp-spray-cloud.png"

HERO_MP4 = HERO_DIR / "nafas-hero.mp4"
HERO_WEBM = HERO_DIR / "nafas-hero.webm"
HERO_POSTER = HERO_DIR / "nafas-hero-poster.webp"
JOURNEY_MP4 = JOURNEY_DIR / "journey-perfume-sequence.mp4"
JOURNEY_WEBM = JOURNEY_DIR / "journey-perfume-sequence.webm"
JOURNEY_POSTER = JOURNEY_DIR / "journey-poster.webp"

FPS = 24
HERO_DURATION = 10.0
JOURNEY_STAGE_DURATIONS = [1.4, 1.8, 1.2, 0.8, 2.0, 2.2]
JOURNEY_DURATION = sum(JOURNEY_STAGE_DURATIONS)
JOURNEY_STAGE_NAMES = [
    "closed",
    "rotate",
    "cap-open",
    "spray",
    "rotate-again",
    "closed-end",
]


@dataclass(frozen=True)
class StageWindow:
    start: float
    end: float

    @property
    def duration(self) -> float:
        return self.end - self.start

    def contains(self, t: float) -> bool:
        return self.start <= t < self.end

    def progress(self, t: float) -> float:
        if self.duration <= 0:
            return 0.0
        return max(0.0, min(1.0, (t - self.start) / self.duration))


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3 - 2 * value)


def ease_in_out(value: float) -> float:
    return 0.5 - (math.cos(math.pi * max(0.0, min(1.0, value))) / 2)


def ensure_dirs() -> None:
    HERO_DIR.mkdir(parents=True, exist_ok=True)
    JOURNEY_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)


def feather_mask(size: tuple[int, int], shape_drawer) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    shape_drawer(draw)
    return mask.filter(ImageFilter.GaussianBlur(2))


def build_open_bottle_asset() -> Image.Image:
    base = Image.open(SRC_OPEN_BOTTLE).convert("RGBA")
    crop = base.crop((1140, 700, 2150, 2130))
    mask = feather_mask(crop.size, lambda draw: (
        draw.polygon(
            [
                (55, 390),
                (125, 330),
                (870, 330),
                (925, 380),
                (925, 1370),
                (865, 1420),
                (150, 1420),
                (55, 1370),
            ],
            fill=255,
        ),
        draw.rounded_rectangle((355, 72, 654, 402), radius=26, fill=255),
        draw.rounded_rectangle((378, 0, 620, 185), radius=34, fill=255),
    ))
    textured = crop.copy()
    textured.putalpha(mask)
    textured = ImageEnhance.Contrast(textured).enhance(1.1)
    canvas = Image.new("RGBA", (1020, 1800), (0, 0, 0, 0))
    canvas.alpha_composite(textured, (5, 205))
    return canvas


def build_closed_bottle_asset() -> Image.Image:
    base = Image.open(SRC_CLOSED_BOTTLE).convert("RGBA")
    crop = base.crop((1500, 600, 2520, 2400))
    mask = feather_mask(crop.size, lambda draw: (
        draw.polygon(
            [
                (250, 350),
                (320, 250),
                (704, 250),
                (785, 330),
                (794, 1712),
                (730, 1780),
                (270, 1780),
                (225, 1710),
            ],
            fill=255,
        ),
        draw.rounded_rectangle((335, 0, 697, 310), radius=48, fill=255),
        draw.rounded_rectangle((395, 205, 632, 480), radius=46, fill=255),
    ))
    textured = crop.copy()
    textured.putalpha(mask)
    textured = ImageEnhance.Contrast(textured).enhance(1.08)
    return textured


def build_closed_cap_asset() -> Image.Image:
    base = Image.open(SRC_CLOSED_BOTTLE).convert("RGBA")
    crop = base.crop((1630, 650, 2390, 1190))
    mask = feather_mask(crop.size, lambda draw: draw.rounded_rectangle((85, 60, 675, 260), radius=56, fill=255))
    crop.putalpha(mask)
    crop = ImageEnhance.Contrast(crop).enhance(1.05)
    return crop


def build_spray_asset() -> Image.Image:
    spray = Image.open(SRC_SPRAY).convert("RGBA")
    spray = ImageOps.fit(spray, (2000, 1200), method=Image.Resampling.LANCZOS, centering=(0.4, 0.45))
    return spray


def make_background(width: int, height: int, t: float, duration: float, *, amber_strength: float = 1.0) -> Image.Image:
    canvas = Image.new("RGBA", (width, height), (7, 7, 10, 255))
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    drift = math.sin((t / max(duration, 0.001)) * math.tau) * 24
    draw.ellipse((-220 + drift, height * 0.48, width * 0.86 + drift, height * 1.24), fill=(95, 45, 18, int(96 * amber_strength)))
    draw.ellipse((width * 0.18, -height * 0.1, width * 1.08, height * 0.94), fill=(142, 92, 54, int(118 * amber_strength)))
    draw.ellipse((width * 0.62, height * -0.08, width * 1.06, height * 0.58), fill=(221, 190, 150, int(54 * amber_strength)))
    overlay = overlay.filter(ImageFilter.GaussianBlur(110))
    canvas.alpha_composite(overlay)

    vignette = Image.new("L", (width, height), 0)
    vg = ImageDraw.Draw(vignette)
    vg.ellipse((-width * 0.1, -height * 0.05, width * 1.1, height * 1.15), fill=195)
    vignette = ImageChops.invert(vignette.filter(ImageFilter.GaussianBlur(80)))
    canvas.putalpha(ImageChops.lighter(canvas.getchannel("A"), vignette))
    canvas = canvas.convert("RGB").convert("RGBA")

    # subtle grain
    rng = np.random.default_rng(int(t * 1000) + width + height)
    noise = rng.integers(0, 255, size=(height, width), dtype=np.uint8)
    noise_im = Image.fromarray(noise, "L").filter(ImageFilter.GaussianBlur(0.35))
    noise_tint = Image.merge("RGBA", (noise_im, noise_im, noise_im, Image.new("L", (width, height), 14)))
    canvas.alpha_composite(noise_tint)
    return canvas


def place_with_shadow(
    canvas: Image.Image,
    asset: Image.Image,
    position: tuple[int, int],
    *,
    shadow_offset: tuple[int, int] = (24, 24),
    shadow_alpha: int = 90,
    shadow_blur: int = 28,
    scale: float = 1.0,
    mirror: bool = False,
    width_scale: float = 1.0,
    rotation: float = 0.0,
    perspective_shift: float = 0.0,
) -> tuple[int, int, int, int]:
    layer = asset
    if mirror:
        layer = ImageOps.mirror(layer)
    if rotation:
        layer = layer.rotate(rotation, resample=Image.Resampling.BICUBIC, expand=True)

    w = max(1, int(layer.width * scale * width_scale))
    h = max(1, int(layer.height * scale))
    layer = layer.resize((w, h), Image.Resampling.LANCZOS)

    if perspective_shift:
        coeff = 0.1 * perspective_shift
        layer = layer.transform(
            layer.size,
            Image.Transform.QUAD,
            (
                coeff * layer.width,
                0,
                layer.width - coeff * layer.width,
                0,
                layer.width,
                layer.height,
                0,
                layer.height,
            ),
            Image.Resampling.BICUBIC,
        )

    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    shadow_alpha_mask = layer.getchannel("A").point(lambda px: int(px * (shadow_alpha / 255)))
    shadow.putalpha(shadow_alpha_mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(shadow_blur))

    x, y = position
    canvas.alpha_composite(shadow, (x + shadow_offset[0], y + shadow_offset[1]))
    canvas.alpha_composite(layer, (x, y))
    return (x, y, x + layer.width, y + layer.height)


def blend_assets(asset_a: Image.Image, asset_b: Image.Image, mix: float) -> Image.Image:
    mix = max(0.0, min(1.0, mix))
    if mix <= 0:
        return asset_a.copy()
    if mix >= 1:
        return asset_b.copy()
    return Image.blend(asset_a, asset_b, mix)


def tint_asset(asset: Image.Image, *, brightness: float = 1.0, contrast: float = 1.0, color: float = 1.0) -> Image.Image:
    out = ImageEnhance.Color(asset).enhance(color)
    out = ImageEnhance.Contrast(out).enhance(contrast)
    out = ImageEnhance.Brightness(out).enhance(brightness)
    return out


def add_mist(canvas: Image.Image, spray: Image.Image, t: float, duration: float, *, opacity: float = 0.22, drift: tuple[int, int] = (0, 0)) -> None:
    phase = t / max(duration, 0.001)
    cloud = spray.resize((int(canvas.width * 0.72), int(canvas.height * 0.56)), Image.Resampling.LANCZOS)
    cloud = tint_asset(cloud, brightness=1.18, contrast=0.92, color=0.08)
    cloud_alpha = cloud.getchannel("A").point(lambda px: int(px * opacity))
    cloud.putalpha(cloud_alpha)
    x = int(canvas.width * -0.08 + math.sin(phase * math.tau) * 26 + drift[0])
    y = int(canvas.height * 0.06 + math.cos(phase * math.tau * 0.7) * 14 + drift[1])
    canvas.alpha_composite(cloud, (x, y))


def build_highlight(width: int, height: int, strength: float) -> Image.Image:
    highlight = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(highlight)
    draw.ellipse((width * 0.52, height * 0.08, width * 1.02, height * 0.78), fill=(236, 214, 177, int(80 * strength)))
    draw.ellipse((-width * 0.12, height * 0.35, width * 0.45, height * 1.08), fill=(120, 64, 34, int(78 * strength)))
    return highlight.filter(ImageFilter.GaussianBlur(68))


def stage_windows() -> list[StageWindow]:
    cursor = 0.0
    windows: list[StageWindow] = []
    for duration in JOURNEY_STAGE_DURATIONS:
        windows.append(StageWindow(cursor, cursor + duration))
        cursor += duration
    return windows


def journey_state(t: float) -> dict[str, float | bool]:
    windows = stage_windows()
    rotation_1 = windows[1]
    open_1 = windows[2]
    spray_1 = windows[3]
    rotation_2 = windows[4]
    close_2 = windows[5]

    cap_lift = 0.0
    cap_closed = True
    spray_strength = 0.0
    rotation_progress = 0.0
    show_cap = True

    if rotation_1.contains(t):
        rotation_progress = ease_in_out(rotation_1.progress(t))
    elif open_1.contains(t):
        cap_lift = ease_in_out(open_1.progress(t))
        cap_closed = False
    elif spray_1.contains(t):
        cap_lift = 1.0
        cap_closed = False
        spray_strength = smoothstep(math.sin(math.pi * spray_1.progress(t)))
    elif rotation_2.contains(t):
        cap_lift = 1.0
        cap_closed = False
        rotation_progress = ease_in_out(rotation_2.progress(t))
        show_cap = False
    elif close_2.contains(t):
        cap_lift = 1.0 - ease_in_out(close_2.progress(t))
        cap_closed = cap_lift < 0.12
        show_cap = True

    return {
        "cap_lift": cap_lift,
        "cap_closed": cap_closed,
        "spray_strength": spray_strength,
        "rotation_progress": rotation_progress,
        "show_cap": show_cap,
    }


def compose_journey_frame(width: int, height: int, t: float, closed_asset: Image.Image, open_asset: Image.Image, cap_asset: Image.Image, spray_asset: Image.Image) -> Image.Image:
    frame = make_background(width, height, t, JOURNEY_DURATION, amber_strength=0.85)
    frame.alpha_composite(build_highlight(width, height, 0.9))
    add_mist(frame, spray_asset, t, JOURNEY_DURATION, opacity=0.12, drift=(120, -50))

    state = journey_state(t)
    rotation_progress = float(state["rotation_progress"])
    angle = rotation_progress * math.tau
    width_scale = 0.24 + 0.76 * abs(math.cos(angle))
    mirror = math.sin(angle) < 0
    perspective = math.sin(angle) * 0.9

    windows = stage_windows()
    open_window = windows[2]
    spray_window = windows[3]
    rotate_2 = windows[4]
    close_window = windows[5]

    open_mix = 0.0
    if open_window.contains(t):
        open_mix = ease_in_out(open_window.progress(t))
    elif spray_window.contains(t) or rotate_2.contains(t):
        open_mix = 1.0
    elif close_window.contains(t):
        open_mix = 1.0 - ease_in_out(close_window.progress(t))

    bottle_base = blend_assets(
        tint_asset(closed_asset, brightness=0.93, contrast=1.04, color=0.85),
        tint_asset(open_asset, brightness=0.94, contrast=1.05, color=0.92),
        open_mix,
    )

    bottle_scale = 0.44
    bottle_x = int(width * 0.1)
    bottle_y = int(height * 0.14)
    place_with_shadow(
        frame,
        bottle_base,
        (bottle_x, bottle_y),
        shadow_offset=(34, 38),
        shadow_alpha=115,
        shadow_blur=36,
        scale=bottle_scale,
        mirror=mirror,
        width_scale=width_scale,
        perspective_shift=perspective,
    )

    # floor reflection
    bottle_reflection = tint_asset(bottle_base, brightness=0.46, contrast=0.9, color=0.5)
    bottle_reflection = ImageOps.flip(bottle_reflection)
    bottle_reflection.putalpha(bottle_reflection.getchannel("A").point(lambda px: int(px * 0.16)))
    reflection = bottle_reflection.resize(
        (
            max(1, int(bottle_reflection.width * bottle_scale * width_scale)),
            max(1, int(bottle_reflection.height * bottle_scale * 0.35)),
        ),
        Image.Resampling.LANCZOS,
    ).filter(ImageFilter.GaussianBlur(3))
    frame.alpha_composite(reflection, (bottle_x + 24, bottle_y + int(height * 0.41)))

    cap_lift = float(state["cap_lift"])
    cap_closed = bool(state["cap_closed"])
    show_cap = bool(state["show_cap"])
    if show_cap or cap_closed:
        cap = tint_asset(cap_asset, brightness=0.95, contrast=1.04, color=0.86)
        cap = cap.resize((int(cap.width * 0.34), int(cap.height * 0.34)), Image.Resampling.LANCZOS)
        cap_x = bottle_x + int(width * 0.085) + int(cap_lift * 10)
        cap_y = bottle_y - int(height * 0.012) - int(cap_lift * 102)
        place_with_shadow(
            frame,
            cap,
            (cap_x, cap_y),
            shadow_offset=(18, 16),
            shadow_alpha=92,
            shadow_blur=24,
            scale=1.0,
        )

    spray_strength = float(state["spray_strength"])
    if spray_strength > 0.01:
        puff = spray_asset.resize(
            (int(width * (0.34 + spray_strength * 0.1)), int(height * (0.26 + spray_strength * 0.06))),
            Image.Resampling.LANCZOS,
        )
        puff = tint_asset(puff, brightness=1.5, contrast=0.78, color=0.1)
        puff_alpha = puff.getchannel("A").point(lambda px: int(px * (0.30 * spray_strength)))
        puff.putalpha(puff_alpha)
        frame.alpha_composite(
            puff,
            (int(width * 0.2), int(height * 0.12)),
        )

    return frame


def compose_hero_frame(width: int, height: int, t: float, bottle_asset: Image.Image, cap_asset: Image.Image, spray_asset: Image.Image) -> Image.Image:
    frame = make_background(width, height, t, HERO_DURATION, amber_strength=1.0)
    frame.alpha_composite(build_highlight(width, height, 1.05))
    add_mist(frame, spray_asset, t, HERO_DURATION, opacity=0.16)
    add_mist(frame, spray_asset, t + 1.7, HERO_DURATION, opacity=0.08, drift=(260, 140))

    loop_phase = t / HERO_DURATION
    bottle_scale = 0.66 + math.sin(loop_phase * math.tau) * 0.02
    width_scale = 0.96 + math.sin(loop_phase * math.tau * 0.5) * 0.04
    bottle_x = int(width * 0.08 + math.sin(loop_phase * math.tau) * 14)
    bottle_y = int(height * 0.09 + math.cos(loop_phase * math.tau * 0.7) * 10)
    place_with_shadow(
        frame,
        tint_asset(bottle_asset, brightness=0.96, contrast=1.06, color=0.94),
        (bottle_x, bottle_y),
        shadow_offset=(38, 44),
        shadow_alpha=120,
        shadow_blur=44,
        scale=bottle_scale,
        width_scale=width_scale,
    )

    side_cap = cap_asset.resize((210, 170), Image.Resampling.LANCZOS)
    side_cap = tint_asset(side_cap, brightness=0.78, contrast=0.95, color=0.88)
    side_cap.putalpha(side_cap.getchannel("A").point(lambda px: int(px * 0.32)))
    side_cap = side_cap.filter(ImageFilter.GaussianBlur(1))
    frame.alpha_composite(side_cap, (int(width * 0.56), int(height * 0.66)))

    return frame


def rgba_to_rgb(frame: Image.Image) -> np.ndarray:
    return np.array(frame.convert("RGB"), dtype=np.uint8)


def write_video(frames: list[np.ndarray], output: Path, *, fps: int, codec: str, extra_args: list[str]) -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ffmpeg,
        "-y",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{frames[0].shape[1]}x{frames[0].shape[0]}",
        "-r",
        str(fps),
        "-i",
        "-",
        "-an",
        "-vcodec",
        codec,
        *extra_args,
        str(output),
    ]
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        assert process.stdin is not None
        for frame in frames:
            process.stdin.write(frame.tobytes())
        process.stdin.close()
        _, stderr = process.communicate()
    finally:
        if process.stdin and not process.stdin.closed:
            process.stdin.close()
    if process.returncode != 0:
        raise RuntimeError(stderr.decode("utf-8", "ignore"))


def render_all() -> None:
    ensure_dirs()
    closed_asset = build_closed_bottle_asset()
    open_asset = build_open_bottle_asset()
    cap_asset = build_closed_cap_asset()
    spray_asset = build_spray_asset()

    # stage previews
    stage_preview_dir = TMP_DIR / "journey-stages"
    stage_preview_dir.mkdir(parents=True, exist_ok=True)
    windows = stage_windows()
    preview_times = [window.start + (window.duration * 0.5) for window in windows]
    for name, preview_time in zip(JOURNEY_STAGE_NAMES, preview_times, strict=True):
        frame = compose_journey_frame(1440, 810, preview_time, closed_asset, open_asset, cap_asset, spray_asset)
        frame.save(stage_preview_dir / f"{name}.png")

    hero_frames: list[np.ndarray] = []
    journey_frames: list[np.ndarray] = []

    hero_total_frames = int(round(HERO_DURATION * FPS))
    journey_total_frames = int(round(JOURNEY_DURATION * FPS))

    for index in range(hero_total_frames):
        t = index / FPS
        frame = compose_hero_frame(1920, 1080, t, closed_asset, cap_asset, spray_asset)
        hero_frames.append(rgba_to_rgb(frame))
        if index == 0:
            frame.save(HERO_POSTER, quality=86, method=6)

    for index in range(journey_total_frames):
        t = index / FPS
        frame = compose_journey_frame(1440, 810, t, closed_asset, open_asset, cap_asset, spray_asset)
        journey_frames.append(rgba_to_rgb(frame))
        if index == 0:
            frame.save(JOURNEY_POSTER, quality=86, method=6)

    write_video(hero_frames, HERO_MP4, fps=FPS, codec="libx264", extra_args=["-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", "-movflags", "+faststart"])
    write_video(hero_frames, HERO_WEBM, fps=FPS, codec="libvpx-vp9", extra_args=["-pix_fmt", "yuv420p", "-b:v", "0", "-crf", "30"])
    write_video(journey_frames, JOURNEY_MP4, fps=FPS, codec="libx264", extra_args=["-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", "-movflags", "+faststart"])
    write_video(journey_frames, JOURNEY_WEBM, fps=FPS, codec="libvpx-vp9", extra_args=["-pix_fmt", "yuv420p", "-b:v", "0", "-crf", "30"])


if __name__ == "__main__":
    render_all()
