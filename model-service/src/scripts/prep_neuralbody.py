import click
import shutil
from pathlib import Path


@click.command()
@click.option("--raw_path", default="/app/src/data", help="Path to raw images.")
@click.option(
    "--dst",
    default="/app/src/data/neural_input",
    help="Destination for neuralbody input.",
)
def rename(raw_path, dst):
    """Rename input images to Neuralbody format."""
    # Move raw images to input directory for neuralbody
    paths = list(Path(raw_path).glob("Cam*"))
    for path in paths:
        # shutil.copytree(path, dst)
        i = 0
        out_dir = Path(dst, path.stem)
        Path.mkdir(out_dir, exist_ok=True)
        # Rename all images within path
        for img in sorted(path.iterdir()):
            output = Path(
                out_dir, str(i).rjust(5, "0") + img.suffix
            )  # Format name as 00000.png, 00001.png, ...
            shutil.move(img, output)
            i += 1


if __name__ == "__main__":
    rename()
