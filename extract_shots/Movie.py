import os, sys
import json
import cv2

import Frame

import utils.logger as logger
LOGGER = logger.Logger("Movie")
#LOGGER.level(logger.DEBUG)

EXTENSION = ".png"

class Movie(object):
    """
    Represents a movie which is a collection of frames that can be written to a json file.
    """

    def __init__(self, movfile_loc, output_dir, remote_dir):
        self.movfile_loc = movfile_loc
        self.movfile_name = movfile_loc.split("/")[-1]
        self.output_dir = output_dir
        self.output_name = output_dir.split("/")[-1]
        self.remote_dir = remote_dir
        LOGGER.horizontal_rule()
        LOGGER.info("Input movie: " + self.movfile_loc)
        LOGGER.info("Saving to: " + self.output_dir)

        self.cap = cv2.VideoCapture(movfile_loc)
        self.total_frames = self.cap.get(cv2.CAP_PROP_FRAME_COUNT)
        LOGGER.debug("Total frame count: " + str(int(self.total_frames)))
        self.start_frame = 100
        self.end_frame = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT) - 1)

        self.frames = []

    def extract_frames(self, frame_count):
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, self.start_frame)

        every_nth_frame = int( (self.end_frame - self.start_frame) / frame_count )
        LOGGER.info("Every " + str(every_nth_frame) + " frames")
        cur_frame = self.start_frame

        retry = 0
        while True:
            LOGGER.info("Frame: " + str(cur_frame))
            flag, frame = self.cap.read()
            if flag:
            # The frame is ready and already captured
                retry = 0
                filename = self.get_frame_filename(cur_frame)
                remote_filename = self.get_frame_filename(cur_frame, remote=True)
                self.frames.append(Frame.Frame(cur_frame, filename, frame, remote_filename))
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

            if cur_frame >= self.end_frame:
                # If the cur frame excceeded the total number of frames, we stop
                break

        jsonfile_name = self.output_dir + "/" + self.output_name+ ".json"
        LOGGER.info("Writing json to: " + jsonfile_name)
        with open(jsonfile_name, "w+") as jsonfile:
            json.dump(self.frames, jsonfile, cls=Frame.FrameEncoder, indent=2)
            LOGGER.info("Wrote data to " + jsonfile_name)

    def get_frame_filename(self, frame, remote=False):
        if not os.path.isdir(self.output_dir):
            LOGGER.debug(self.output_dir + " doesn't exist. Creating.")
            os.mkdir(self.output_dir)
        if not remote:
            return self.output_dir + "/" + self.movfile_name + "_" + "{0:0>3}".format(frame) + ".png"
        else:
            if self.remote_dir == None:
                return None
            else:
                return self.remote_dir + "/" + self.movfile_name + "_" + "{0:0>3}".format(frame) + ".png"

