import socket
import struct
import numpy as np
import cv2
import matplotlib.pyplot as plt
import os
from datetime import datetime

TCP_IP = "127.0.0.1"
TCP_PORT = 5005

VIDEO_DIR = r"C:\Users\spec\Documents\programming\projects\GardenRobot\media\videos"
IMAGE_DIR = r"C:\Users\spec\Documents\programming\projects\GardenRobot\media\images"
SAVE_EVERY = 20

os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(IMAGE_DIR, exist_ok=True)

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((TCP_IP, TCP_PORT))
print(f"Connected to Isaac Sim at {TCP_IP}:{TCP_PORT}")

data_buffer = b""
payload_size = struct.calcsize(">I")
frame_count = 0

plt.ion()
fig, ax = plt.subplots()

video_writer = None

try:
    while True:
        while len(data_buffer) < payload_size:
            data_buffer += sock.recv(4096)
        packed_msg_size = data_buffer[:payload_size]
        data_buffer = data_buffer[payload_size:]
        msg_size = struct.unpack(">I", packed_msg_size)[0]

        while len(data_buffer) < msg_size:
            data_buffer += sock.recv(4096)
        frame_data = data_buffer[:msg_size]
        data_buffer = data_buffer[msg_size:]

        frame = cv2.imdecode(np.frombuffer(frame_data, dtype=np.uint8), cv2.IMREAD_COLOR)

        if video_writer is None:
            height, width, _ = frame.shape
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            video_path = os.path.join(VIDEO_DIR, f"recording_{timestamp}.mp4")

            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            video_writer = cv2.VideoWriter(video_path, fourcc, 30.0, (width, height))

            print(f"[Video] Recording started: {video_path}")

        video_writer.write(frame)

        if frame_count % SAVE_EVERY == 0:
            img_path = os.path.join(IMAGE_DIR, f"frame_{frame_count:06d}.jpg")
            cv2.imwrite(img_path, frame)

        frame_count += 1

        ax.clear()
        ax.imshow(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        ax.axis('off')
        plt.pause(0.001)

except KeyboardInterrupt:
    print("Stopping recording...")

finally:
    sock.close()
    if video_writer is not None:
        video_writer.release()
        print(f"[Video] Saved correctly: {video_path}")
    plt.close(fig)
