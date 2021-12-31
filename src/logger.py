#!/usr/bin/env python3

from datetime import datetime

OUTPUT_FILENAME_INDOOR = './temps.txt'
OUTPUT_FILENAME_OUTDOOR = './temps_outdoor.txt'
MAXLINES = 100

INPUT_FILENAME_INDOOR = './data_now.txt'
INPUT_FILENAME_OUTDOOR = './weather_now.txt'

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
file_indoor = open(INPUT_FILENAME_INDOOR, 'r')
file_outdoor = open(INPUT_FILENAME_OUTDOOR, 'r')

#indoor
num_lines = file_len(OUTPUT_FILENAME_INDOOR)
entry = '{} {} {}'.format(now, float(file_indoor.readline()), float(file_indoor.readline()))
file_indoor.close()

file_append(OUTPUT_FILENAME_INDOOR, entry, num_lines < MAXLINES)

#Outdoor
num_lines = file_len(OUTPUT_FILENAME_OUTDOOR)
entry = '{} {} {}'.format(now, float(file_outdoor.readline()), float(file_outdoor.readline()))
file_outdoor.close()

file_append(OUTPUT_FILENAME_OUTDOOR, entry, num_lines < MAXLINES)