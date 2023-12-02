from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from pytube import YouTube
import torch
import whisper

app = Flask(__name__)
CORS(app, resources={r'*': {'origins': '*'}})

device = 'cuda' if torch.cuda.is_available() else 'cpu'

@app.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        # Get the URL from the request data
        request_data = request.get_json()
        url = request_data.get('url')

        if not url:
            raise ValueError("Missing 'url' parameter in the request.")

        # Download the audio from the YouTube video
        yt = YouTube(url)
        video = yt.streams.filter(only_audio=True).first()
        out_file = video.download(filename="audio.wav")

        # Load the whisper model
        print("Loading model")
        model = whisper.load_model("tiny")
        print("Loaded model")

        # Transcribe the audio
        transcript = model.transcribe("audio.wav")
        print("Transcription successful.")
        return jsonify({'transcript': transcript["text"]})

    except ValueError as ve:
        error_message = f"ValueError: {str(ve)}"
        print(error_message)
        return jsonify({'error': error_message}), 400

    except Exception as e:
        error_message = f"Error during transcription: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
