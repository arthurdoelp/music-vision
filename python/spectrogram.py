import sys
import os, json
import numpy as np
import matplotlib.pyplot as plot
import audiosegment
from memory_profiler import profile

audiosegment.converter = '/usr/local/Cellar/ffmpeg/4.4_2'

# SONG PREDICTION
# @profile
# def my_func():
# filename = sys.argv[1]
# filename = '/Users/arthurdoelp/dev/projects/python-projects/music-vision/uploads/03_Baby_Cant_Leave_it_Alone.m4a'
# filename = "/Users/arthurdoelp/dev/projects/python-projects/music-vision/python/uploads/03_Baby_Cant_Leave_it_Alone.m4a"
filename = '03_Baby_Cant_Leave_it_Alone.m4a'
# filepath = os.path.abspath(os.path.join("python/uploads", filename))
filepath = os.path.abspath(os.path.join("python/uploads", filename))
file_id = filename[:-4]
# # file_id = filename[13:-4]
# # file_id = filename[69:-4]
# # Create the audiosegment file
# seg = audiosegment.from_file(filepath)
# # Convert any 2 channel tracks to mono so that it can be converted into a spec
# seg = seg.set_channels(1)
# # Create the spectrogram
# freqs, times, amplitudes = seg.spectrogram(window_length_s=.03, overlap=.5)
# amplitudes = 10 * np.log10(amplitudes + 1e-9)
# # Plot the spectrogram using time as the x axis, frequency as y axis and amplitude as color gradient
# # plot.pcolormesh(times, freqs, amplitudes, shading='auto')
# plot.pcolormesh(times, freqs, amplitudes, shading='auto')
# # Remove all axis graphics so we have just the image of the spectrogram contents and nothing else
# plot.axis('off')
# plot.subplots_adjust(left=0,right=1,bottom=0,top=1)
# # Save the file to the prediction_image folder with the file name
# # prediction_image_file_path = os.path.abspath("python/prediction_image") + "/" + file_id + '.png'
prediction_image_file_path = os.path.abspath("python/prediction_image") + "/" + file_id + '.png'
# plot.savefig(prediction_image_file_path)

output = {
"file_path": prediction_image_file_path
}
output = json.dumps(output)
print(output)

# if __name__ == '__main__':
#     my_func()

sys.stdout.flush()