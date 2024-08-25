import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array

# Load pre-trained COCO-SSD model
model = tf.keras.applications.MobileNetV2(weights="imagenet")


def detect_objects(frame):
    # Perform object detection using the COCO-SSD model
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame = cv2.resize(frame, (224, 224))
    frame_array = img_to_array(frame)
    frame_array = preprocess_input(frame_array)
    frame_array = np.expand_dims(frame_array, axis=0)
    predictions = model.predict(frame_array)
    return predictions

def main():
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Apply image processing filters
        processed_frame = frame

        # Display the processed frame
        cv2.imshow("Processed Frame", processed_frame)

        # Perform object detection
        predictions = detect_objects(frame)

        # Display object detection results
        for pred in predictions:
            # Draw bounding boxes on the frame
            xmin, ymin, xmax, ymax = pred['bbox']
            cv2.rectangle(frame, (int(xmin), int(ymin)), (int(xmax), int(ymax)), (0, 255, 0), 2)
            cv2.putText(frame, f"{pred['class']} {pred['score']:.2f}", (int(xmin), int(ymin) - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # Display the original frame with object detection
        cv2.imshow("Object Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
