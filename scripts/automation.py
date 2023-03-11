import os, sys

def automate():
    USAGE = "USAGE python automate"
    if(len(sys.argv) != 1) or '--help' in sys.argv or '-h' in sys.argv:
        print(USAGE)
        os._exit(0)
    
    ### Variables
    RAW_INPUT_PATH: str = './raw'
    OUTPUT_PATH: str = './CIHP_PGN'

    ### Run MakeDatasets
    try:
        # Store output in CIHP_PGN so test_pgn.py does not need to be modified
        os.system('python scripts/make_dataset.py ' + RAW_INPUT_PATH + " CIHP " + OUTPUT_PATH)
    except:
        # We would need a cleanup function. And/Or define a checkpoint 
       return RuntimeError('Error')
    
    ### Run CIHP_PGN
    try:
       # CD into CIHP_PGN so relative paths in test_pgn is correct
       os.chdir('./CIHP_PGN')
       os.system('python test_pgn.py')
       # CD back to main directory
       os.chdir('..')
    except:
        return RuntimeError("CIHP_PGN Error")
    

if __name__ == "__main__":
    automate()