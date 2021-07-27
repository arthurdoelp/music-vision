import sys
from dotenv import load_dotenv
from pathlib import Path  # Python 3.6+ only
env_path = Path('../config/') / 'config.env'
load_dotenv(dotenv_path=env_path)
import numpy as np
import pandas as pd
from sklearn.cluster import MiniBatchKMeans
# from sklearn.cluster import KMeans
import joblib
import cv2
import os, json
import urllib.request
import cloudinary
import cloudinary.api

cloudinary.config( 
  cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.environ.get("CLOUDINARY_API_KEY"), 
  api_secret = os.environ.get("CLOUDINARY_API_SECRET")
)

results = cloudinary.api.resources(type = "upload", prefix = "song-spectrograms/", max_results = 150)

urls = []
for result in results["resources"]:
    url = result["url"]
    urls.append(url)

images = []
ids = []

# Open image urls, convert image to np array, opencv will decode the uint8 image in color then resize the image to accommodate the tf model
for url in urls:
    resp = urllib.request.urlopen(url)
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    # image = cv2.resize(image, (224, 224))
    image = cv2.resize(image, (432, 288))
    image = image[:,:,0]
    images.append(image)
    id = url[79:-11]
    ids.append(id)

# # Read images and reshape the images for prep for feature extraction
images = np.array(np.float32(images).reshape(len(images), -1)/255)
# print(images)

# Create keras model for feature extraction - Never ended up using this. Adding tensorflow took too much of my slug size so I had to remove it.
# model = tf.keras.applications.MobileNetV2(include_top=False, weights='imagenet', input_shape=(224, 224, 3))
# print(model)
# predictions = model.predict(images.reshape(-1, 224, 224, 3))
# print(predictions)
# pred_images = predictions.reshape(images.shape[0], -1)
# print(pred_images)

# predictions = images.reshape(-1, 108, 72, 3)
# pred_images = predictions.reshape(images.shape[0], -1)

# K-Means Model
k = 70
kmodel = MiniBatchKMeans(n_clusters = k, random_state=728)
kmodel.fit(images)
kpredictions = kmodel.predict(images)
print(kpredictions)

joblib_file = "K_Means_Model_70_432_288.pkl"
joblib.dump(kmodel, joblib_file)

model_predictions_df = pd.DataFrame({'kpredictions': list(kpredictions), 'ids': list(ids)}, columns=['kpredictions', 'ids'])
print(model_predictions_df.head())
model_predictions_df.to_csv(os.path.abspath("model_predictions_432_288.csv"))

sys.stdout.flush()