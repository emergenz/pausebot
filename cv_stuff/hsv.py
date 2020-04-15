import cv2
import numpy as np
file = '/Users/michaelhuber/Desktop/Algos/files/boxes.mp4'

def nothing(x):
    pass

cap = cv2.VideoCapture(0)

cv2.namedWindow('regler')
cv2.createTrackbar('masken_value1','regler',0,255,nothing)
cv2.createTrackbar('masken_value2','regler',0,255,nothing)
cv2.createTrackbar('masken_value3','regler',0,255,nothing)
cv2.createTrackbar('masken_value4','regler',0,255,nothing)
cv2.createTrackbar('masken_value5','regler',0,255,nothing)
cv2.createTrackbar('masken_value6','regler',0,255,nothing)

while(True):

    ret, frame = cap.read()

    mv1=cv2.getTrackbarPos('masken_value1','regler')
    mv2=cv2.getTrackbarPos('masken_value2','regler')
    mv3=cv2.getTrackbarPos('masken_value3','regler')
    mv4=cv2.getTrackbarPos('masken_value4','regler')
    mv5=cv2.getTrackbarPos('masken_value5','regler')
    mv6=cv2.getTrackbarPos('masken_value6','regler')

    hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    #red_mask
    low_red = np.array([mv1,mv2,mv3]) #0,160,80good setting

    high_red = np.array([mv4,mv5,mv6])

    red_mask = cv2.inRange(hsv_frame,low_red,high_red)

    contours,_ = cv2.findContours(red_mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_NONE)

    for c in contours:
        konturen = cv2.drawContours(frame, c, -1, (0,255,0), 1)
    cv2.imshow('frame',frame)
    cv2.imshow('konturen',red_mask)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
