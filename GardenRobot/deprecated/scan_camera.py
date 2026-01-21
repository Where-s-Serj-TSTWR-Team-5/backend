import os
import time
import torch
from ultralytics import YOLO

base_dir = os.path.dirname(__file__)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = YOLO('best.pt')

image_folder = '/home/hzjarvis/pycharmgithub/GardenRobot/jetson_scripts/cam_images'
processed_images = set()

CONFIDENCE_THRESHOLD = 0.5

while True:
    all_files = [f for f in os.listdir(image_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    new_files = [f for f in all_files if f not in processed_images]

    for file_name in new_files:
        file_path = os.path.join(image_folder, file_name)

        results = model(file_path, conf=CONFIDENCE_THRESHOLD, verbose=False)

        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                label = model.names[cls_id]
                conf = float(box.conf[0])

                coords = box.xyxy[0].tolist()

                print(f"Detected {label} at {coords} with {conf:.2%} confidence")

        processed_images.add(file_name)

        try:
            os.remove(file_path)
            print(f"Deleted {file_name}")
        except Exception as e:
            print(f"Failed to delete {file_name}: {e}")

    time.sleep(1)
