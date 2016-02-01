import logging
import logging.handlers

DEBUG = logging.DEBUG
INFO = logging.INFO

class Logger(logging.Logger):
    def __init__(self, name):
        super().__init__(name)
        self.setLevel(logging.DEBUG)
        log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

        timed_log_handler = logging.handlers.TimedRotatingFileHandler(name + ".log", backupCount=10)
        timed_log_handler.setFormatter(log_formatter)
        timed_log_handler.setLevel(logging.DEBUG)

        self.addHandler(timed_log_handler)

        stream_log_handler = logging.StreamHandler()
        stream_log_handler.setFormatter(log_formatter)
        stream_log_handler.setLevel(logging.DEBUG)

        self.addHandler(stream_log_handler)

    def horizontal_rule(self):
        self.info("===============================================================================")
