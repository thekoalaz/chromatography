# -*- coding: utf-8 -*-
import argparse

import Movie

FRAME_COUNT = 50

if __name__ == "__main__":
    parser = argparse.ArgumentParser();
    parser.add_argument("movfile_name", help="The input movie file name")
    parser.add_argument("-o", "--output", help="The output directory", default=False)
    parser.add_argument("-n", "--number", help="The number of frames to capture", default=FRAME_COUNT, type=int)
    args = parser.parse_args()

    if args.output:
        movie = Movie.Movie(args.movfile_name, args.output)
    else:
        movie = Movie.Movie(args.movfile_name)

    movie.extract_frames(args.number)
