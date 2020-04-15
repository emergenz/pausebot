import cv2
import numpy as np
file = '/Users/michaelhuber/Desktop/Algos/files/boxes.mp4'

cap = cv2.VideoCapture(file)
while(True):
    _, org_frame = cap.read()

    blur_frame = cv2.blur(org_frame,(5,5))

    _, thresh_frame = cv2.threshold(blur_frame,150,170,cv2.THRESH_BINARY)

    cv2.imshow('blurred and threshed image',thresh_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
#works
