import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import numpy as np


CATEGORIES = ["pottery", "bamboo_cane", "handloom", "wood_carving"]
SPLITS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "dataset", "splits")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)


def train_mobilenet_v2(epochs: int = 4, batch_size: int = 8, lr: float = 0.001):
    """
    Trains a MobileNetV2 transfer learning model for Goan craft categorization.
    Uses data augmentations and outputs genuine evaluation metrics.
    """
    train_dir = os.path.join(SPLITS_DIR, "train")
    val_dir = os.path.join(SPLITS_DIR, "val")
    test_dir = os.path.join(SPLITS_DIR, "test")

    if not os.path.exists(train_dir) or not os.listdir(train_dir):
        print("Dataset splits not found. Please run scripts/init_dataset.py and scripts/dataset_pipeline.py first.")
        return

    # Data Augmentation & Preprocessing transforms
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    eval_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    train_dataset = datasets.ImageFolder(train_dir, transform=train_transform)
    val_dataset = datasets.ImageFolder(val_dir, transform=eval_transform)
    test_dataset = datasets.ImageFolder(test_dir, transform=eval_transform)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

    num_classes = len(train_dataset.classes)
    class_names = train_dataset.classes
    print(f"Detected {num_classes} classes: {class_names}")

    # Load MobileNetV2 transfer learning backbone
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training using device: {device}")

    # Use MobileNetV2 with transfer learning weights
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)

    # Freeze feature extraction layers
    for param in model.features.parameters():
        param.requires_grad = False

    # Replace classifier head for our 4 craft classes
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(in_features, 128),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(128, num_classes)
    )
    model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=lr)

    history = {"train_loss": [], "val_loss": [], "val_acc": []}

    print("\nStarting MobileNetV2 Transfer Learning Fine-Tuning...")
    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * images.size(0)

        epoch_train_loss = running_loss / len(train_dataset)

        # Validation phase
        model.eval()
        val_loss = 0.0
        val_correct = 0
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                val_correct += torch.sum(preds == labels.data).item()

        epoch_val_loss = val_loss / len(val_dataset)
        epoch_val_acc = val_correct / len(val_dataset)

        history["train_loss"].append(round(epoch_train_loss, 4))
        history["val_loss"].append(round(epoch_val_loss, 4))
        history["val_acc"].append(round(epoch_val_acc, 4))

        print(f"Epoch {epoch}/{epochs} | Train Loss: {epoch_train_loss:.4f} | Val Loss: {epoch_val_loss:.4f} | Val Acc: {epoch_val_acc*100:.1f}%")

    # Final Evaluation on Held-Out Test Set
    model.eval()
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())

    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)

    acc = accuracy_score(all_labels, all_preds)
    report = classification_report(all_labels, all_preds, target_names=class_names, output_dict=True, zero_division=0)
    conf_matrix = confusion_matrix(all_labels, all_preds).tolist()

    print("\n--- Test Set Classification Report ---")
    print(classification_report(all_labels, all_preds, target_names=class_names, zero_division=0))

    # Save Model Weights
    checkpoint_path = os.path.join(MODEL_DIR, "craft_classifier.pt")
    torch.save(model.state_dict(), checkpoint_path)
    print(f"Saved trained model checkpoint to: {checkpoint_path}")

    # Save Metrics File
    metrics_data = {
        "model_architecture": "MobileNetV2 (Transfer Learning with Custom Dropout & Dense Head)",
        "framework": "PyTorch / Torchvision",
        "dataset_version": "v1.0-GoanHeritageCrafts",
        "split_ratio": "70% Train / 15% Val / 15% Test",
        "epochs": epochs,
        "test_accuracy": round(float(acc), 4),
        "test_accuracy_percentage": round(float(acc) * 100, 2),
        "classes": class_names,
        "classification_report": report,
        "confusion_matrix": conf_matrix,
        "training_history": history
    }

    metrics_path = os.path.join(MODEL_DIR, "training_metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_data, f, indent=2)
    print(f"Saved evaluation metrics to: {metrics_path}")


if __name__ == "__main__":
    train_mobilenet_v2()

