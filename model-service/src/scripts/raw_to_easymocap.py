import click
from pathlib import Path
import subprocess
import shutil

DATA_TYPE = [".png", ".jpg"]


@click.command()
@click.argument("img_path")
@click.argument("dataset_name")
@click.argument("intri")
@click.argument("extri")
def create_input(img_path, dataset_name, intri, extri):
    """Create input dataset for EasyMocap.

    INTRI and EXTRI are the camera intrinsic and extrinsic parameters
    """
    # Create output path and directory
    output = Path(".", dataset_name, "videos")
    Path.mkdir(output, parents=True, exist_ok=True)
    # Check if files have correct extension
    files = [i for i in Path(img_path).iterdir() if i.suffix in DATA_TYPE]
    # Use ffmpeg to convert each png to mp4 for easymocap
    for f in files:
        subprocess.check_output(
            "ffmpeg -r 25 -f image2 -i "
            + str(f)
            + " -vcodec libx264 -crf 18 -pix_fmt yuv420p "
            + str(Path(output, (f.stem + ".mp4"))),
            shell=True,
        )
    # Move yml files into output directory
    shutil.move(intri, dataset_name)
    shutil.move(extri, dataset_name)


if __name__ == "__main__":
    create_input()
