from ultralytics import YOLO

model = YOLO('yolov8n.pt')

model.train(data='/home/hzjarvis/pycharmgithub/GardenRobot/jetson_scripts/dataset/data.yaml',
            epochs = 50,
            imgsz =640,
            device=0,
            batch=4,
            plots=True,
            cache=False,
            amp=False)
