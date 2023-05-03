import click
from pathlib import Path
import subprocess
import os
import shutil

DATA_TYPE = [".png", ".jpg"]
OFFSET = 3


@click.command()
@click.argument("src")
@click.argument("dst")
def create_input(src, dst):
    """Create input video for EasyMocap from raw images."""
    # Create output path and directory
    output = Path(dst, "videos")
    Path.mkdir(output, parents=True, exist_ok=True)
    # Check if files have correct extension
    files = [i.stem for i in Path(src).iterdir() if i.suffix in DATA_TYPE]
    # Get starting frame
    start = min(files)
    cam = Path(src).stem[OFFSET:]
    video = cam + ".mp4"
    # Change to src directory for ffmpeg
    dir = os.getcwd()
    os.chdir(src)
    # Use ffmpeg to convert each png to mp4 for easymocap
    subprocess.check_output(
        "ffmpeg -r 25 -start_number "
        + start
        + " -f image2 -i %03d"
        + DATA_TYPE[0]
        + " -vcodec libx264 -crf 18 -pix_fmt yuv420p "
        + video,
        shell=True,
    )
    # Change back to work dir
    os.chdir(dir)
    # Move video into output directory
    shutil.move(str(Path(src, video)), output)


if __name__ == "__main__":
    create_input()
