import cv2
import numpy as np
img = cv2.imread('a.webp')
gausssian_blur=cv2.GaussianBlur(img,(7,7),2)
sharpened1= cv2.addWeighted(img,1.5,gausssian_blur,-0.5,0)
cv2.imshow('sharpened 1', sharpened1)