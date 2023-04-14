import click
import shutil
from pathlib import Path


@click.command()
@click.option("--mask_path", default="", help="Path to CIHP mask.")
@click.option(
    "--dst",
    default="/app/src/data/neural_input",
    help="Destination for neuralbody input.",
)
def setup(mask_path, dst):
    """Setup input for Neuralbody."""
    # Move CIHP mask to input directory for neuralbody
    shutil.move(mask_path, dst)


if __name__ == "__main__":
    setup()
