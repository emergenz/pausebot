import cv2
import numpy as np
file = '/Users/michaelhuber/Desktop/Algos/files/boxes.mp4'

cap = cv2.VideoCapture(0)
fgbg = cv2.bgsegm.createBackgroundSubtractorMOG()
#bgsegm.createBackgroundSubtractorMOG
#BackgroundSubtractorGMG
#createBackgroundSubtractorMOG2
while(True):
    ret, frame = cap.read()

    fgmask = fgbg.apply(frame)

    cv2.imshow('frame',fgmask)
    k = cv2.waitKey(20) & 0xff
    if k == 22:
        break

cap.release()
cv2.destroyAllWindows()
