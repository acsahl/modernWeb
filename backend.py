from flask import Flask, Response
from flask_cors import CORS
from deepface import DeepFace
import cv2
import threading
import time

# Confirm script is running
print("✅ DeepFace Flask server starting...")

app = Flask(__name__)
CORS(app, resources={r"/emotion": {"origins": "*"}})

emotion_result = "neutral"

@app.route('/emotion')
def get_emotion():
    global emotion_result
    print(f"[GET /emotion] Returning: {emotion_result}")
    return Response(emotion_result, mimetype='text/plain')

def analyze_emotion():
    global emotion_result
    print("[INFO] Starting webcam...")
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("[ERROR] Could not open webcam.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[WARNING] Failed to grab frame.")
            continue

        try:
            print("[INFO] Analyzing frame...")
            result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            detected = result[0]['dominant_emotion']
            print(f"[INFO] Detected Emotion: {detected}")
            emotion_result = detected
        except Exception as e:
            print(f"[ERROR] DeepFace failed: {e}")

        time.sleep(1)

if __name__ == '__main__':
    thread = threading.Thread(target=analyze_emotion)
    thread.daemon = True
    thread.start()

    print("[INFO] Starting Flask server on port 5050...")
    app.run(port=5050, debug=True, use_reloader=False)
