# -*- coding: utf-8 -*-
import cv2
import math
import sys

OUTPUT_DIR = "100_stills"
WIDTH = 240


def run():
    movie = sys.argv[1]
    
    cap = cv2.CreateFileCapturef(file_path)
    cv2.QueryFrame(cap)
    
    # skip frames in the beginning, if neccessary
    start_frame = int( movie.attrib["start_frame"] )
    for i in range(start_frame):
        cv2.QueryFrame(cap)
    
    end_frame = int( movie.attrib["end_frame"] )
    every_nth_frame = int( (end_frame - start_frame) / 100 )
    print("every" + str(every_nth_frame) + "frames")
    frame = start_frame
    counter = 1
    
    while 1:
        print(counter)
        img = cv2.QueryFrame(cap)
        if not img or frame > end_frame:
            break
        
        img_small = cv2.CreateImage((WIDTH, int( img.height * float(WIDTH)/img.width )), cv2.IPL_DEPTH_8U, 3)
        cv2.Resize(img, img_small, cv2.CV_INTER_CUBIC)
        
        cv2.SaveImage(OUTPUT_DIR + "\\still_%07d.jpg" % (frame), img_small)
        
        for i in range(every_nth_frame-1):
            cv2.GrabFrame(cap)
        
        frame += every_nth_frame
        counter += 1
    
    #raw_input("- done -")
    return


if __name__ == "__main__":
    run()
