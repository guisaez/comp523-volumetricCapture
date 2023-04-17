import click
import shutil
import os
from pathlib import Path

DATA_TYPE = [".png", ".jpg"]


@click.command()
@click.argument("src")
@click.argument("dst")
def separate(src, dst):
    """Separates images in SRC by camera and place in DST.
    Image names must have the following format: Frame#_Cam#_XXXXX
    Example: 141_Cam2_color_11780
    """
    # Check if files have correct extension and separate name with delim="_"
    files = [i for i in Path(src).iterdir() if i.suffix in DATA_TYPE]
    for f in files:
        cam = str(f.stem).split("_")[1]
        output = Path(dst, cam)
        # Create directory for camera
        Path.mkdir(output, exist_ok=True)
        # Rename file for ffmpeg
        name = str(f.stem).split("_")[0] + f.suffix
        shutil.move(f, Path(output, name))
        # Move file to camera directory
        #shutil.move(name, output)


if __name__ == "__main__":
    separate()
