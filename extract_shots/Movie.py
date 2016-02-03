import os, sys
import json
import cv2

import Frame
import utils.logger as logger
LOGGER = logger.Logger("Movie")

OUTPUT_DIR = "output"
EXTENSION = ".png"

class Movie(object):
    """
    Represents a movie which is a collection of frames that can be written to a json file.
    """

    def __init__(self, movfile_loc, output_dir=OUTPUT_DIR):
        self.movfile_loc = movfile_loc
        self.movfile_name = movfile_loc.split("/")[-1]
        self.output_dir = output_dir
        self.output_name = output_dir.split("/")[-1]
        LOGGER.info("Input movie: " + self.movfile_loc)
        LOGGER.info("Saving to: " + self.output_dir)

        self.cap = cv2.VideoCapture(movfile_loc)
        self.total_frames = self.cap.get(cv2.CAP_PROP_FRAME_COUNT)
        self.start_frame = 0
        self.end_frame = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT) - 1)

        self.frames = []

    def extract_frames(self, frame_count):
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, self.start_frame)

        every_nth_frame = int( (self.end_frame - self.start_frame) / frame_count )
        LOGGER.info("Every " + str(every_nth_frame) + " frames")
        cur_frame = self.start_frame

        retry = 0
        while True:
            LOGGER.debug("Frame: " + str(cur_frame))
            flag, frame = self.cap.read()
            if flag:
            # The frame is ready and already captured
                retry = 0
                filename = self.get_frame_filename(cur_frame)
                self.frames.append(Frame.Frame(cur_frame, filename, frame))
                self.cap.set(cv2.CAP_PROP_POS_FRAMES, cur_frame + every_nth_frame)
                pos_frame = self.cap.get(cv2.CAP_PROP_POS_FRAMES)
                cur_frame += every_nth_frame
            else:
                # The next frame is not ready, so we try to read it again
                self.cap.set(cv2.CAP_PROP_POS_FRAMES, cur_frame-1)
                LOGGER.debug("frame is not ready")
                # It is better to wait for a while for the next frame to be ready
                retry += 1
                cv2.waitKey(1000)
                if retry > 10:
                    # If retry passes 10, give up
                    LOGGER.debug("Retried too many times. Giving up on frame " + str(cur_frame))
                    cur_frame += every_nth_frame

            if cur_frame > self.total_frames - 1:
                # If the number of captured frames is equal to the total number of frames, we stop
                break

        jsonfile_name = self.output_dir + "/" + self.output_name+ ".json"
        LOGGER.info("Writing json to: " + jsonfile_name)
        with open(jsonfile_name, "w") as jsonfile:
            json.dump(self.frames, jsonfile, cls=Frame.FrameEncoder, indent=2)
            LOGGER.info("Wrote data to " + jsonfile_name)

    def get_frame_filename(self, frame):
        if not os.path.isdir(self.output_dir):
            os.mkdir(self.output_dir)
        return self.output_dir + "/" + self.movfile_name + "_" + "{0:0>3}".format(frame) + ".png"

