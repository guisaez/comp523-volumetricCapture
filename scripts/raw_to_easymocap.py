import os, sys, shutil

DATA_TYPE = ['png','PNG','jpg','JPG']
def create_input():
    USAGE = "USAGE: python path/to/raw_to_easymocap.py path/to/raw_images path/to/intri.yml path/to/extri.yml"
    if(len(sys.argv) != 4) or '--help' in sys.argv or '-h' in sys.argv:
        print(USAGE)
        os._exit(0)
    # Raw images path
    path_img = sys.argv[1]
    dataset_name = 'easymocap_input'
    # Create output path and directory
    output = os.path.join(dataset_name, 'videos')
    os.makedirs(output)
    # Check if files have correct extension
    files = [i for i in os.listdir(path_img) if i.split('.')[-1] in DATA_TYPE]
    # Use ffmpeg to convert each png to mp4 for easymocap
    for f in files:
        os.system('ffmpeg -r 25 -f image2 -i ' + os.path.join(path_img, f) + ' -vcodec libx264 -crf 18 -pix_fmt yuv420p ' + os.path.join(output, (f.split('.')[0] + '.mp4')))
    # Move yml files into output directory
    shutil.move(sys.argv[2], dataset_name)
    shutil.move(sys.argv[3], dataset_name)

if __name__ == '__main__':
    create_input()