import os, sys

def automate():
    USAGE = "USAGE python automate"
    if(len(sys.argv) != 1) or '--help' in sys.argv or '-h' in sys.argv:
        print(USAGE)
        os._exit(0)
    
    ### Variables
    RAW_INPUT_PATH: str = './raw/input'
    OUTPUT_PATH: str = './raw'

    ### Run MakeDatasets
    try:
        os.system('python scripts/make_dataset.py ' + RAW_INPUT_PATH + " output " + OUTPUT_PATH)
    except:
        # We would need a cleanup function. And/Or define a checkpoint 
       return RuntimeError('Error')
    
    ### Run CIHP_PGN
    try:
       os.system('python CIHP_PGN/test_pgn.py')
    except:
        return RuntimeError("CIHP_PGN Error")
    

if __name__ == "__main__":
    automate()