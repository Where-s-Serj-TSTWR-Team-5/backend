import cv2
import time
import sys
from ultralytics import YOLO


def run_garden_scan():
    model_path = 'best.pt'
    print(f"--- Starting GardenRobot Scan ---\nLoading model: {model_path}...")
    model = YOLO(model_path)

    gst_str = (
        "nvarguscamerasrc sensor-id=0 ! "
        "video/x-raw(memory:NVMM), width=(int)1920, height=(int)1080, format=(string)NV12, framerate=(fraction)30/1 ! "
        "nvvidconv flip-method=0 ! "
        "video/x-raw, width=(int)1920, height=(int)1080, format=(string)BGRx ! "
        "videoconvert ! "
        "video/x-raw, format=(string)BGR ! appsink drop=True"
    )

    cap = None
    for attempt in range(3):
        print(f"Initializing Camera (Attempt {attempt + 1}/3)...")
        cap = cv2.VideoCapture(gst_str, cv2.CAP_GSTREAMER)
        time.sleep(2.0)

        if cap.isOpened():
            print("Camera opened successfully!")
            break
        else:
            print("Failed to open camera. Resetting daemon...")
            cap.release()
            import subprocess
            subprocess.run(["sudo", "systemctl", "restart", "nvargus-daemon"])
            time.sleep(2)

    if not cap or not cap.isOpened():
        print("CRITICAL ERROR: GPU/Argus memory is busy or GStreamer link failed.")
        sys.exit(1)

    prev_time = 0
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error: Empty frame received.")
                break

            results = model(frame, stream=True, conf=0.25, verbose=False)

            annotated_frame = frame.copy()
            for r in results:
                annotated_frame = r.plot()

            curr_time = time.time()
            fps = 1 / (curr_time - prev_time) if (curr_time - prev_time) > 0 else 0
            prev_time = curr_time
            cv2.putText(annotated_frame, f"FPS: {fps:.1f}", (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            cv2.imshow("GardenRobot Feed", annotated_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except KeyboardInterrupt:
        print("\nStopping Scan...")
    except Exception as e:
        print(f"Unexpected Error: {e}")
    finally:
        if cap:
            cap.release()
        cv2.destroyAllWindows()
        print("Resources released. Session closed.")

if __name__ == "__main__":
    run_garden_scan()
