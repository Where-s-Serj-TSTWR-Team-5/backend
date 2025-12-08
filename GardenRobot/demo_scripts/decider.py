import os
import time
import cv2
import numpy as np

WATCH_FOLDER = r"C:\Users\spec\Documents\programming\projects\backend\GardenRobot\media\images"

LOWER_RED1 = np.array([0, 120, 70])
UPPER_RED1 = np.array([10, 255, 255])
LOWER_RED2 = np.array([170, 120, 70])
UPPER_RED2 = np.array([180, 255, 255])

LOWER_YELLOW = np.array([20, 100, 100])
UPPER_YELLOW = np.array([35, 255, 255])

LOWER_GREEN = np.array([40, 150, 150])
UPPER_GREEN = np.array([80, 255, 255])

LOWER_PURPLE = np.array([140, 100, 100])
UPPER_PURPLE = np.array([170, 255, 255])


def classify_image(path):
    img = cv2.imread(path)

    if img is None:
        return "error"

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    mask_red1 = cv2.inRange(hsv, LOWER_RED1, UPPER_RED1)
    mask_red2 = cv2.inRange(hsv, LOWER_RED2, UPPER_RED2)
    red_mask = cv2.bitwise_or(mask_red1, mask_red2)
    yellow_mask = cv2.inRange(hsv, LOWER_YELLOW, UPPER_YELLOW)
    alert_mask = cv2.bitwise_or(red_mask, yellow_mask)

    green_mask = cv2.inRange(hsv, LOWER_GREEN, UPPER_GREEN)
    purple_mask = cv2.inRange(hsv, LOWER_PURPLE, UPPER_PURPLE)
    healthy_mask = cv2.bitwise_or(green_mask, purple_mask)

    alert_pixels = np.sum(alert_mask > 0)
    healthy_pixels = np.sum(healthy_mask > 0)

    PIXEL_THRESHOLD = 250  # adjust sensitivity

    if alert_pixels > PIXEL_THRESHOLD and alert_pixels > healthy_pixels:
        return "---- Plant needs more water!! ----"
    elif healthy_pixels > PIXEL_THRESHOLD and healthy_pixels > alert_pixels:
        return "---- Plant is healthy! Proceed! ----"
    else:
        return "Travelling..."


def watch_folder(path):
    print(f"Watching folder:\n{path}\nPress CTRL+C to quit.\n")

    seen_files = set()

    while True:
        files = [f for f in os.listdir(path)
                 if f.lower().endswith((".jpg", ".png", ".jpeg"))]

        for file in files:
            full = os.path.join(path, file)

            if full not in seen_files:
                seen_files.add(full)

                result = classify_image(full)

                print(f"{result}")

        time.sleep(2)


if __name__ == "__main__":
    try:
        watch_folder(WATCH_FOLDER)
    except KeyboardInterrupt:
        print("\nStopped watching.")
