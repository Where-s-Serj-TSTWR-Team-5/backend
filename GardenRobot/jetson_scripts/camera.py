import cv2
import os

save_dir = "cam_images"
os.makedirs(save_dir, exist_ok=True)

gst_str = (
    "nvarguscamerasrc sensor-id=0 ! "
    "video/x-raw(memory:NVMM), width=1920, height=1080, format=NV12, framerate=30/1 ! "
    "nvvidconv ! "
    "video/x-raw, format=BGRx ! "
    "videoconvert ! "
    "video/x-raw, format=BGR ! appsink drop=True"
)

cap = cv2.VideoCapture(gst_str, cv2.CAP_GSTREAMER)

frame_count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break

    if frame_count % 30 == 0:
        filename = os.path.join(save_dir, f"frame_{frame_count:04d}.jpg")
        cv2.imwrite(filename, frame)

    cv2.imshow("Camera", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    frame_count += 1

cap.release()
cv2.destroyAllWindows()

