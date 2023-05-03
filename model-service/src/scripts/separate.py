import click
import shutil
import os
from pathlib import Path

DATA_TYPE = [".png", ".jpg"]


@click.command()
@click.argument("src")
@click.argument("dst")
def separate(src, dst):
    """Separates images in SRC by camera and places them in DST.
    Image names must have the following format: Frame#_Cam#_XXXXX
    Example: 141_Cam2_color_11780
    """
    # Check if files have correct extension and separate name with delim="_"
    files = [
        i for i in Path(src).iterdir() if i.suffix in DATA_TYPE and "vis" not in i.stem
    ]
    for f in files:
        cam = str(f.stem).split("_")[1]
        out = Path(dst, cam)
        # Create directory for camera
        Path.mkdir(out, exist_ok=True)
        # Rename file for ffmpeg
        name = str(f.stem).split("_")[0] + f.suffix
        # Move file to camera directory
        shutil.move(f, Path(out, name))


if __name__ == "__main__":
    separate()
