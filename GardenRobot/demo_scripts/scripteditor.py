import socket
import struct
import cv2
import numpy as np
import threading
import time
from isaacsim.sensors.camera import Camera

from projects.VolcanoFinder.models import MyFirstCNN

CAMERA_PRIM_PATH = "/World/GardenRobot/Front_Sensor/Sensor_Mount/Camera"
TCP_IP = "127.0.0.1"
TCP_PORT = 5005
RESOLUTION = (256, 256)

camera = Camera(prim_path=CAMERA_PRIM_PATH, resolution=RESOLUTION)
camera.initialize()
camera.add_motion_vectors_to_frame()

def tcp_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((TCP_IP, TCP_PORT))
    server_socket.listen(1)
    print(f"[Server] Waiting for connection on {TCP_IP}:{TCP_PORT}...")
    conn, addr = server_socket.accept()
    print(f"[Server] Connected by {addr}")

    try:
        while True:
            frame = camera.get_rgba()[:, :, :3]
            frame_uint8 = (frame * 255).astype(np.uint8)

            _, buffer = cv2.imencode('.jpg', frame_uint8)
            data = buffer.tobytes()

            conn.sendall(struct.pack(">I", len(data)) + data)

            time.sleep(0.05)
    finally:
        conn.close()
        server_socket.close()
        print("[Server] Stream closed")

threading.Thread(target=tcp_server, daemon=True).start()
