import cv2
import numpy as np
file = '/Users/michaelhuber/Desktop/Algos/files/boxes.mp4'

cap = cv2.VideoCapture(file)
while(True):
    ret, frame = cap.read()
    alpha = 5
    beta = 0
    contrast = cv2.addWeighted(frame,alpha,np.zeros(frame.shape,frame.dtype),0,beta)

    cv2.imshow('frame',contrast)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
#works
