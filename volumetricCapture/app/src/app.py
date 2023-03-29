from flask import Flask, request, jsonify
from pathlib import Path
import zipfile

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    print(request.files)
    if 'file' not in request.files:
        return jsonify({'error': 'No file sent'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.endswith('.zip'):
        return jsonify({'error': 'File must be a .zip folder'}), 400
    
    # Save the file to dis
    save_dir = Path('./data/input')
    save_dir.mkdir(parents=True, exist_ok=True)
    file_path = save_dir / 'input.zip'
    file.save(file_path)  

    #Extract the contents of the zip folder to a new directory
    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        zip_ref.extractall('./data')

    
    return jsonify({'message': 'File uploaded successfully'}), 200

    
if __name__ == "__main__":
    print("VC Server Running in Port 3000")
    app.run(debug=True, host='0.0.0.0', port=3000)