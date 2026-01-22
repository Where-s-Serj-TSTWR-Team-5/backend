from ultralytics import YOLO

model = YOLO('yolo26n.pt')

model.train(data='dataset/data.yaml',
            epochs=1,
            device=0,
            batch=64,
            nbs=64,
            amp=True,
            plots=True,
            workers=0)
