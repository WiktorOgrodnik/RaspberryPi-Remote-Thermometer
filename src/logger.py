#!/usr/bin/env python3

from datetime import datetime

FILENAME = '/home/pi/temps.txt'
MAXLINES = 100

INPUT_FILENAME = '/home/pi/data_now.txt'

def file_len(fname):
    return sum(1 for _ in open (fname))

def file_append(fname, entry, append = True):
    file = open(fname, 'r')

    lines = file.readlines()
    if (not append):
        lines = lines[:-1]

    file.close()

    file = open(fname, 'w')
    file.write('{}\n'.format (entry))
    for i in lines:
        file.write(i)
    file.close()

now = datetime.now().isoformat()
file = open(INPUT_FILENAME, 'r')

num_lines = file_len(FILENAME)
entry = '{} {} {}'.format(now, int(file.readline()), int(file.readline()))
file.close()

file_append(FILENAME, entry, num_lines < MAXLINES)
