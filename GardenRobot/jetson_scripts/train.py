from ultralytics import YOLO

model = YOLO('yolov8n.pt')

model.train(data='/home/hzjarvis/pycharmgithub/GardenRobot/jetson_scripts/dataset/data.yaml',
            epochs = 1,
            imgsz =320,
            device=0,
            batch=1,
            plots=True,
            cache=False,
            amp=False,
            workers=0)
