# sitting_timer.py
import time
import pyttsx3
from plyer import notification

def speak(text):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

def send_reminder():
    notification.notify(
        title="Time to Move!",
        message="You’ve been sitting for 1 hour. Stand up and stretch 🚶",
        timeout=10
    )
    speak("You have been sitting for one hour. Please stand up and move around.")

def get_posture_state():
    try:
        with open("posture_state.txt", "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        return "NONE"

def sitting_tracker():
    sitting_start = None
    standing_start = None
    
    while True:
        posture = get_posture_state()
        now = time.time()

        if posture in ["GOOD", "BAD"]:  # sitting
            if sitting_start is None:
                sitting_start = now
            standing_start = None

            if now - sitting_start >= 30:  # 1 hour
                send_reminder()
                sitting_start = now  # reset after reminder

        elif posture == "STANDING":
            if standing_start is None:
                standing_start = now
            if now - standing_start >= 10:  # 2 minutes standing
                sitting_start = None

        time.sleep(5)  # check every 5s

if __name__ == "__main__":
    sitting_tracker()
