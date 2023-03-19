import click
import shutil
from pathlib import Path
from PIL import Image

DATA_TYPE = [".png", ".jpg"]


@click.command()
@click.argument("src")
@click.argument("name")
@click.argument("dst")
@click.option("--delete", is_flag=True, default=False, help="Delete dst directory")
def create_dataset(src, name, dst, delete):
    """Creates a dataset from raw images for CIHP_PGN"""
    click.echo("Generating dataset ...")
    # Create output path for dataset
    path_dataset = Path(dst, "datasets", name)
    if Path(path_dataset).is_dir():
        if delete:
            # Delete dst directory
            shutil.rmtree(path_dataset)
        else:
            click.echo("Dataset already exists")
            return
    path_edge = Path(path_dataset, "edges")
    path_images = Path(path_dataset, "images")
    path_list = Path(path_dataset, "list")
    for p in [path_edge, path_images, path_list]:
        Path.mkdir(p, parents=True)
    files = [i for i in Path(src).iterdir() if i.suffix in DATA_TYPE]

    for f in files:
        im = Image.open(f)
        # im = im.resize((im.size[0]*720//im.size[1],720), Image.LANCZOS) # if you run out of GPU memory
        im1 = Image.new("L", im.size)
        im = im.rotate(90)
        im1 = im1.rotate(90)
        im.save(Path(path_images, f.name))
        im1.save(Path(path_edge, f.stem + ".png"))
    with open(Path(path_list, "val.txt"), "w") as flist:
        for f in files:
            flist.write("/images/%s /edges/%s\n" % (f.name, f.name))
    with open(Path(path_list, "val_id.txt"), "w") as flist:
        for f in files:
            flist.write("%s\n" % (f.stem))

    click.echo("Dataset Completed!")


if __name__ == "__main__":
    create_dataset()
