import os
import json
import torch
from torchvision import datasets, transforms, models
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import numpy as np

SPLITS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "dataset", "splits")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "models", "craft_classifier.pt")
METRICS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "models", "training_metrics.json")


def evaluate_saved_model():
    """Evaluates the saved model on the test split and displays report."""
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            metrics = json.load(f)
        print("=== Loaded Training & Test Metrics ===")
        print(f"Architecture: {metrics.get('model_architecture')}")
        print(f"Test Accuracy: {metrics.get('test_accuracy_percentage')}%")
        print(f"Classes: {metrics.get('classes')}")
        print("\nConfusion Matrix:")
        print(np.array(metrics.get("confusion_matrix")))
        return metrics

    print("No training metrics found. Please run train_classifier.py first.")
    return None


if __name__ == "__main__":
    evaluate_saved_model()

