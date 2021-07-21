import sys
from dotenv import load_dotenv
from pathlib import Path  # Python 3.6+ only
env_path = Path('../config/') / 'config.env'
load_dotenv(dotenv_path=env_path)
import matplotlib.pyplot as plot
import audiosegment
import numpy as np
import pandas as pd
from sklearn.feature_extraction import image
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import cv2
import os, glob, json
import urllib.request
import cloudinary
import cloudinary.api

# audiosegment.converter = '/usr/local/Cellar/ffmpeg/4.4_2'

cloudinary.config( 
  cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.environ.get("CLOUDINARY_API_KEY"), 
  api_secret = os.environ.get("CLOUDINARY_API_SECRET")
)

results = cloudinary.api.resources(type = "upload", prefix = "song-spectrograms/", max_results = 200)

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
    image = cv2.resize(image, (224, 224))
    images.append(image)
    id = url[79:-11]
    ids.append(id)

# Read images and reshape the images for prep for feature extraction
images = np.array(np.float32(images).reshape(len(images), -1)/255)
# print(images)

# Create keras model for feature extraction
# model = tf.keras.applications.MobileNetV2(include_top=False, weights='imagenet', input_shape=(224, 224, 3))
# print(model)
# predictions = model.predict(images.reshape(-1, 224, 224, 3))
# print(predictions)
# pred_images = predictions.reshape(images.shape[0], -1)
# print(pred_images)

predictions = images.reshape(-1, 224, 224, 3)
pred_images = predictions.reshape(images.shape[0], -1)

# K-Means Model
k = 55
kmodel = KMeans(n_clusters = k, random_state=728)
kmodel.fit(pred_images)
kpredictions = kmodel.predict(pred_images)
# print(kpredictions)


model_predictions_df = pd.DataFrame({'kpredictions': list(kpredictions), 'ids': list(ids)}, columns=['kpredictions', 'ids'])
# print(model_predictions_df.head())


# SONG PREDICTION

# filename = sys.argv[1]
# filename = '/Users/arthurdoelp/dev/projects/python-projects/music-vision/uploads/03_Baby_Cant_Leave_it_Alone.m4a'
# filename = "/Users/arthurdoelp/dev/projects/python-projects/music-vision/python/uploads/03_Baby_Cant_Leave_it_Alone.m4a"
filename = '03_Baby_Cant_Leave_it_Alone.m4a'
# filepath = os.path.abspath(os.path.join("python/uploads", filename))
filepath = os.path.abspath(os.path.join("python/uploads", filename))
# filepath = os.path.abspath(filename)
# print(str(filepath))
file_id = filename[:-4]
# file_id = filename[13:-4]
# file_id = filename[69:-4]
# print(file_id)
# Create the audiosegment file
seg = audiosegment.from_file(filepath)
# Convert any 2 channel tracks to mono so that it can be converted into a spec
seg = seg.set_channels(1)
# Create the spectrogram
freqs, times, amplitudes = seg.spectrogram(window_length_s=.03, overlap=.5)
amplitudes = 10 * np.log10(amplitudes + 1e-9)
# Plot the spectrogram using time as the x axis, frequency as y axis and amplitude as color gradient
plot.pcolormesh(times, freqs, amplitudes)
# Remove all axis graphics so we have just the image of the spectrogram contents and nothing else
plot.axis('off')
plot.subplots_adjust(left=0,right=1,bottom=0,top=1)
# Save the file to the prediction_image folder with the file name
# prediction_image_file_path = os.path.abspath("python/prediction_image") + "/" + file_id + '.png'
prediction_image_file_path = os.path.abspath("python/prediction_image") + "/" + file_id + '.png'
# print(str(prediction_image_file_path))
plot.savefig(prediction_image_file_path)


# Run the prediction method to compare prediction image against the model
# pred_image_dir = os.path.abspath("python/prediction_image")
pred_image_dir = os.path.abspath("python/prediction_image")
pred_image_glob_dir = pred_image_dir + '/*.png'
img = [cv2.resize(cv2.imread(file), (224, 224)) for file in glob.glob(pred_image_glob_dir)]
img = np.array(np.float32(img).reshape(len(img), -1)/255)
# prediction = model.predict(img.reshape(-1, 224, 224, 3))
# pred_image = prediction.reshape(img.shape[0], -1)
kprediction = kmodel.predict(img)
kprediction = str(kprediction).strip('[]')
kprediction = int(kprediction)
# print("Cluster:",kprediction)


# Collect Song Ids
filtered_model_predictions_df = model_predictions_df[model_predictions_df["kpredictions"] == kprediction]["ids"].values.tolist()
# print(filtered_model_predictions_df)
song_ids = ["Date"] + filtered_model_predictions_df

# Load Song Performance Dataset
# song_performance_excel_filepath = os.path.abspath("python/songs_dataset_sample.csv")
song_performance_excel_filepath = os.path.abspath("songs_dataset_sample.csv")
songs_df = pd.read_csv(song_performance_excel_filepath)

# Filter dataset to reflect only the most similar songs
filtered_songs_df = songs_df[song_ids]

# Create Weighted Average Column
filtered_songs_df["avg"] = filtered_songs_df.mean(axis=1)
filtered_songs_df["Date"] = filtered_songs_df.index


# REGRESSION MODEL

# test vs training data
df_train, df_test = train_test_split(filtered_songs_df, test_size=0.3, random_state=99)

target = "avg" #what is our y variable? which column is in our df?
 
features = ["Date"] # x vars or predictors

x_train = df_train[features]
y_train = df_train[target]

x_test = df_test[features]
y_test = df_test[target]

# MODEL TRAINING
regression = LinearRegression()
regression.fit(x_train, y_train) 

# MODEL EVALUATION
y_train_pred = regression.predict(x_train)

y_test_pred = regression.predict(x_test)

adjusted_r_squared = 1 - (((1 - r2_score(y_test, y_test_pred)) * (len(x_test) - 1)) / (len(x_test) - len(features) - 1))
adjusted_r_squared_percentage = "{:.2%}".format(adjusted_r_squared)

# Predict the regression
num_dates = []

for date in range(0,84):
    num_date = len(filtered_songs_df) + date
    num_dates.append(num_date)

predicted_date_nums = pd.DataFrame(num_dates)
regression_prediction = regression.predict(predicted_date_nums)
prediction_df = pd.DataFrame(regression_prediction)

# Calculates the present value of the revenues (10% / 365) to show the discounting each day
prediction_df["revenues"] = ((prediction_df[0] * 0.00318) * (1/(1.0002739726027 ** (prediction_df[0].index + 1))))

total_plays = round(prediction_df.sum()[0], 0)
total_revenues = round(prediction_df.sum()["revenues"], 2)

output = {
  'similar_songs': filtered_model_predictions_df,
  'adjusted_r_squared': adjusted_r_squared_percentage,
  'total_plays': total_plays,
  'total_revenues': total_revenues
}

os.remove(prediction_image_file_path)

output = json.dumps(output)
print(output)

sys.stdout.flush()



# https://stackoverflow.com/questions/56739322/pydub-cant-find-ffmpeg-although-its-installed-and-in-path