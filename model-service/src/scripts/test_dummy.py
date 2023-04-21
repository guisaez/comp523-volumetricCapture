import time
import subprocess

def test_dummy():
    try:
        print(subprocess.check_output(
            'source /app/venv/bin/activate && pip list'
        , shell = True))
    except:
        return "Error"
    
    return "e234322dee32243123"

if __name__ == "__main__":
    test_dummy()
    