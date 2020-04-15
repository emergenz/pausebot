import cv2
import numpy as np
file = '/Users/michaelhuber/Desktop/Algos/files/boxes.mp4'

cap = cv2.VideoCapture(file)
while(True):
    ret, frame = cap.read()

    ret1,thresh1 = cv2.threshold(frame,150,170,cv2.THRESH_BINARY)

    cv2.imshow('frame',thresh1)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
#works
