import matplotlib.pyplot as plt
import numpy as np
import cv2

image = cv2.imread('chair_man.jpg')
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
row, col = 1, 2
fig, axs = plt.subplots(row, col, figsize=(15, 10))
fig.tight_layout()

axs[0].imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
axs[0].set_title('Original')

axs[1].imshow(cv2.cvtColor(gray_image, cv2.COLOR_BGR2RGB))
axs[1].set_title('Grayscale')

fig.show()