import cv2
import numpy as np
file = '/Users/michaelhuber/Desktop/Algos/files/boxes.mp4'

def nothing(x):
    pass

cap = cv2.VideoCapture(0)

cv2.namedWindow('window_name')
cv2.createTrackbar('blur_constant','window_name', 2, 179, nothing)

while(True):
    _,frame = cap.read()

    x = cv2.getTrackbarPos('blur_constant','window_name')

    blurImg = cv2.blur(frame,(x,x))


    cv2.imshow('blurred image',blurImg)

    key = cv2.waitKey(1)
    if key == 27:
        break


cap.release()
cv2.destroyAllWindows()
#works
