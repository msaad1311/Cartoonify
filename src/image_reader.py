# from pyodide.http import pyfetch
# from js import document
# import asyncio
# from io import BytesIO
import matplotlib.pyplot as plt
# import imageio.v3 as iio
import io, base64
import cv2

img = cv2.imread("./chair_man.jpg")
gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# print(img.shape)

plt.imshow(img)
plt.savefig('image.png',dpi=100)
# plt.show()