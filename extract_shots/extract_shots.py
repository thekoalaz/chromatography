# -*- coding: utf-8 -*-
import argparse

import Movie

FRAME_COUNT = 50
OUTPUT_DIR = "output/"

if __name__ == "__main__":
    parser = argparse.ArgumentParser();
    parser.add_argument("movfile_name", help="The input movie file name")
    parser.add_argument("-o", "--output", help="The output directory", default=OUTPUT_DIR)
    parser.add_argument("-n", "--number", help="The number of frames to capture", default=FRAME_COUNT, type=int)
    parser.add_argument("-r", "--remote", help="Remote file name if you plan to server the images somewhere else.", default=None)
    args = parser.parse_args()

    movie = Movie.Movie(args.movfile_name, args.output, args.remote)

    movie.extract_frames(args.number)

