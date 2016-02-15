import json

import cv2
import colorsys
import colorweave

import utils.logger as logger
LOGGER = logger.Logger("Movie")
LOGGER.level(logger.DEBUG)

class Frame(object):
    def __init__(self, frame_number, filename, frame):
        self.filename = filename
        self.frame_number = frame_number
        b, g, r, a = cv2.mean(frame)
        self.frame_color_RGB = (r, g, b)
        self.frame_color_HSV = colorsys.rgb_to_hls(r, g, b)
        LOGGER.debug("Saving image to: " + self.filename)
        cv2.imwrite(filename, frame)

        palette = colorweave.palette(path=filename, n=6, format="css3")
        self.palette = []
        for hex, name in palette.items():
            self.palette.append({hex: name})
        LOGGER.debug("Palette is: " + str(palette))

class FrameEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Frame):
            return {
                     "file": obj.filename,
                     "framenumber": obj.frame_number,
                     "averageColorRGB": obj.frame_color_RGB,
                     "averageColorHSV": obj.frame_color_HSV,
                     "palette": obj.palette
                   }
        return json.JSONEncoder(self, obj)
