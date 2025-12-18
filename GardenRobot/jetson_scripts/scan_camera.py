import os
import time
import torch
from PIL import Image
import torchvision.transforms as transforms
from GardenRobot.pipeline.garden_cnn import GardenCNN

base_dir = os.path.dirname(__file__)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = GardenCNN().to(device)
model.load_state_dict(torch.load(
    os.path.join(base_dir, "..", "pipeline/cnns", "9261CEL.pth"),
    map_location=device,
    weights_only=False
))
model.eval()

transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize([0.5,0.5,0.5], [0.5, 0.5, 0.5])
])

image_folder = '/home/hzjarvis/pycharmgithub/GardenRobot/jetson_scripts/cam_images'
processed_images = set()

class_map = {
    0: "Apple_healthy",
    1: "Apple_not_healthy",
    2: "Pepper_healthy",
    3: "Pepper_not_healthy",
    4: "Potato_healthy",
    5: "Potato_not_healthy",
    6: "Tomato_healthy",
    7: "Tomato_not_healthy",
}

while True:
    all_files = [f for f in os.listdir(image_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    new_files = [f for f in all_files if f not in processed_images]

    for file_name in new_files:
        file_path = os.path.join(image_folder, file_name)
        try:
            image = Image.open(file_path).convert('RGB')
        except Exception as e:
            print(f"Failed to open {file_name}: {e}")
            continue

        img_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(img_tensor)
            probs = torch.softmax(output, dim=1)
            pred_idx = torch.argmax(probs, dim=1).item()
            confidence = probs[0, pred_idx].item()

        label = class_map[pred_idx]
        print(f"{file_name} -> {label}, {confidence:.2%} confidence")

        processed_images.add(file_name)

        try:
            os.remove(file_path)
            print(f"Deleted {file_name}")
        except Exception as e:
            print(f"Failed to delete {file_name}: {e}")

    time.sleep(1)
