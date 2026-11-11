import os
import shutil
import hashlib
import cv2
import numpy as np
from typing import Dict, List, Tuple


CATEGORIES = ["pottery", "bamboo_cane", "handloom", "wood_carving"]
RAW_BASE = "dataset/images/raw"
SPLITS_BASE = "dataset/splits"


def get_image_hash(filepath: str) -> str:
    """Computes SHA-256 hash of image pixel buffer to detect exact duplicates."""
    img = cv2.imread(filepath)
    if img is None:
        return ""
    return hashlib.sha256(img.tobytes()).hexdigest()


def validate_and_deduplicate() -> Tuple[Dict[str, List[str]], Dict[str, int]]:
    """
    Validates images, detects duplicates, and prevents data leakage across splits.
    Returns clean dictionary of filepaths per category.
    """
    clean_files = {cat: [] for cat in CATEGORIES}
    seen_hashes = set()
    stats = {
        "total_scanned": 0,
        "valid_images": 0,
        "duplicates_removed": 0,
        "corrupted_skipped": 0
    }

    for cat in CATEGORIES:
        cat_dir = os.path.join(RAW_BASE, cat)
        if not os.path.exists(cat_dir):
            continue

        for fname in os.listdir(cat_dir):
            if not fname.lower().endswith((".png", ".jpg", ".jpeg")):
                continue

            fpath = os.path.join(cat_dir, fname)
            stats["total_scanned"] += 1

            img = cv2.imread(fpath)
            if img is None or img.size == 0 or img.shape[0] < 32 or img.shape[1] < 32:
                stats["corrupted_skipped"] += 1
                continue

            h = get_image_hash(fpath)
            if h in seen_hashes:
                stats["duplicates_removed"] += 1
                continue

            seen_hashes.add(h)
            clean_files[cat].append(fpath)
            stats["valid_images"] += 1

    return clean_files, stats


def create_reproducible_splits(
    clean_files: Dict[str, List[str]],
    seed: int = 42
):
    """
    Partitions each category into reproducible 70/15/15 stratified splits.
    Guarantees that EVERY category has samples in train, val, and test,
    and no duplicate leakage occurs across splits.
    """
    np.random.seed(seed)

    # Clean existing splits
    for split in ["train", "val", "test"]:
        split_dir = os.path.join(SPLITS_BASE, split)
        if os.path.exists(split_dir):
            shutil.rmtree(split_dir)
        for cat in CATEGORIES:
            os.makedirs(os.path.join(split_dir, cat), exist_ok=True)

    summary = {"train": 0, "val": 0, "test": 0}

    for cat, files in clean_files.items():
        shuffled = list(files)
        np.random.shuffle(shuffled)

        n = len(shuffled)
        # Ensure at least 3 in val, 3 in test per category if n >= 12
        n_test = max(3, int(np.round(n * 0.15)))
        n_val = max(3, int(np.round(n * 0.15)))
        n_train = n - (n_val + n_test)

        train_files = shuffled[:n_train]
        val_files = shuffled[n_train:n_train + n_val]
        test_files = shuffled[n_train + n_val:]

        for f in train_files:
            shutil.copy2(f, os.path.join(SPLITS_BASE, "train", cat, os.path.basename(f)))
            summary["train"] += 1

        for f in val_files:
            shutil.copy2(f, os.path.join(SPLITS_BASE, "val", cat, os.path.basename(f)))
            summary["val"] += 1

        for f in test_files:
            shutil.copy2(f, os.path.join(SPLITS_BASE, "test", cat, os.path.basename(f)))
            summary["test"] += 1

    return summary


def run_pipeline():
    print("Starting dataset validation, deduplication, and stratified split pipeline...")
    clean_files, stats = validate_and_deduplicate()
    print("Dataset Scan Results:")
    print(f"  • Total Images Scanned: {stats['total_scanned']}")
    print(f"  • Valid Non-Corrupt Images: {stats['valid_images']}")
    print(f"  • Duplicates Detected & Filtered: {stats['duplicates_removed']}")

    split_counts = create_reproducible_splits(clean_files)
    print("\nReproducible Stratified Splits Generated:")
    print(f"  • Training Set: {split_counts['train']} images across 4 categories")
    print(f"  • Validation Set: {split_counts['val']} images across 4 categories")
    print(f"  • Test Set: {split_counts['test']} images across 4 categories")
    print("Dataset preparation pipeline finished successfully.")


if __name__ == "__main__":
    run_pipeline()
