from flask import Flask, request, jsonify
from pathlib import Path

import shutil
import zipfile

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file sent'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.endswith('.zip'):
        return jsonify({'error': 'File must be a .zip folder'}), 400
    
    # Save the file to disk
    save_dir = Path('./src/data/input')
    save_dir.mkdir(parents=True, exist_ok=True)
    file_path = save_dir / 'input.zip'
    file.save(file_path)  

    #Extract the contents of the zip folder to a new directory
    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        zip_ref.extractall(save_dir)

    Path.unlink(Path(file_path))

    return jsonify({'message': 'File uploaded successfully'}), 200

@app.route('/upload/config', methods= ['POST'])
def upload_config_file():
    if 'extri' not in request.files or 'intri' not in request.files:
        return jsonify({'error': 'No file sent'}), 400
    
    extri = request.files['extri']
    intri = request.files['intri']
    if extri.filename == '' or intri.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not extri.filename.endswith('.yml') or not intri.filename.endswith('.yml'):
        return jsonify({'error': 'File must be a .yml file'}), 400
    

    # Save the file to disk
    save_dir = Path('./src/data/input')
    save_dir.mkdir(parents=True, exist_ok=True)
    extri_path = save_dir / 'extri.yml'
    extri.save(extri_path)  
    intri_path = save_dir / 'intri.yml'
    intri.save(intri_path)

    return jsonify({'message': 'Config files uploaded successfully'}), 200

@app.route('/run', methods = ['GET'])
def run():

    

    return jsonify({'message': 'App is running'}, 200)

if __name__ == "__main__":
    print("VC Server Running in Port 3000")
    app.run(debug=True, host='0.0.0.0', port=3000)