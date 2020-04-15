import cv2
import numpy as np
file = '/Users/michaelhuber/Desktop/Algos/files/boxes.mp4'

cap = cv2.VideoCapture(file)
while(True):
    ret, frame = cap.read()

    blurImg = cv2.blur(frame,(5,5))

    cv2.imshow('blurred image',blurImg)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
#works
