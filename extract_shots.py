# -*- coding: utf-8 -*-
import cv2
import math
import os, sys

OUTPUT_DIR = "output"
EXTENSION = ".png"
FRAME_COUNT = 50
WIDTH = 240

def get_frame_filename(mov_name, frame):
    if not os.path.isdir(OUTPUT_DIR):
        os.mkdir(OUTPUT_DIR)
    return OUTPUT_DIR + "/" + mov_name + "_" + str(frame) + ".png"

def run():
    file_path = sys.argv[1]
    
    cap = cv2.VideoCapture(file_path)
    total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    start_frame = 0
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    
    end_frame = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) - 1)
    every_nth_frame = int( (end_frame - start_frame) / FRAME_COUNT )
    print("every" + str(every_nth_frame) + "frames")
    cur_frame = start_frame
    count = 0
    
    while True:
        print("Frame: " + str(cur_frame))
        flag, frame = cap.read()
        if flag:
        # The frame is ready and already captured
            filename = get_frame_filename(file_path, cur_frame) 
            cv2.imwrite(filename, frame)
            cap.set(cv2.CAP_PROP_POS_FRAMES, cur_frame + every_nth_frame)
            pos_frame = cap.get(cv2.CAP_PROP_POS_FRAMES)
            print(str(pos_frame)+" frames")
            cur_frame += every_nth_frame
        else:
            # The next frame is not ready, so we try to read it again
            cap.set(cv2.CAP_PROP_POS_FRAMES, cur_frame-1)
            print("frame is not ready")
            # It is better to wait for a while for the next frame to be ready
            cv2.waitKey(1000)

        if cur_frame > total_frames:
            # If the number of captured frames is equal to the total number of frames,
            # we stop
            break
    
    return


if __name__ == "__main__":
    run()
