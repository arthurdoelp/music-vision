import sys
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import joblib
import cv2
import os, json
# from memory_profiler import profile

# # # @profile
# # # def my_func():

# Load the k-means model from the pickle
kmodel = joblib.load(os.path.abspath("python/K_Means_Model_70_432_288.pkl"))

# Load the df of the pre-classified songs
model_predictions_df = pd.read_csv(os.path.abspath("python/model_predictions_432_288.csv"))

# grab the full file path of the spectrogram image created from the spectrogram.py script
prediction_image_file_path = sys.argv[1]

# # Run the prediction method to compare prediction image against the model
# # pred_image_dir = os.path.abspath("python/prediction_image")
# # pred_image_dir = os.path.abspath("prediction_image")
# # pred_image_glob_dir = pred_image_dir + '/*.png'
# # img = [cv2.resize(cv2.imread(file), (224, 224)) for file in glob.glob(pred_image_glob_dir)]
imgs = [cv2.resize(cv2.imread(prediction_image_file_path), (432, 288))]
imgs = [img[:,:,0] for img in imgs]
imgs = np.array(np.float32(imgs).reshape(len(imgs), -1)/255)
# # prediction = model.predict(img.reshape(-1, 224, 224, 3))
# # pred_image = prediction.reshape(img.shape[0], -1)
kprediction = kmodel.predict(imgs)
kprediction = str(kprediction).strip('[]')
kprediction = int(kprediction)
# print("Cluster:",kprediction)

# Collect Song Ids
filtered_model_predictions_df = model_predictions_df[model_predictions_df["kpredictions"] == kprediction]["ids"].values.tolist()
song_ids = ["Date"] + filtered_model_predictions_df

# Load Song Performance Dataset
song_performance_excel_filepath = os.path.abspath("python/songs_dataset_sample.csv")
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

# # if __name__ == '__main__':
# #   my_func()

sys.stdout.flush()


# https://stackoverflow.com/questions/56739322/pydub-cant-find-ffmpeg-although-its-installed-and-in-path
# https://www.kaggle.com/prmohanty/python-how-to-save-and-load-ml-models
# https://towardsdatascience.com/k-means-clustering-with-scikit-learn-6b47a369a83c
# https://towardsdatascience.com/using-k-means-clustering-for-image-segregation-fd80bea8412d