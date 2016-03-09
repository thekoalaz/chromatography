import scipy
from scipy.io import wavfile
import matplotlib.pyplot as plt
import numpy as np


def show_info(aname, a):
	print "Array", aname
	print "shape:", a.shape
	print "dtype:", a.dtype
	print "min, max:", a.min(), a.max()
	print

rate, data = wavfile.read("DarkKnight.wav")
show_info("data", data)


# read audio samples
#rate, data = read("daffyduck1.wav")
audio = [[], []]
audio[0] = data[:,0]
audio[1] = data[:,1]
print data.shape
# plot the first 1024 samples
plt.plot(audio[0][0:1048576])
plt.plot(audio[1][0:1048576])
# label the axes
plt.ylabel("Amplitude")
plt.xlabel("Time (samples)")
# set the title
plt.title("Flute Sample")
# display the plot


plt.show()