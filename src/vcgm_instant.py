#!/usr/bin/env python

from vcgencmd import Vcgencmd

FILENAME = './pi_now.txt' # File to save live data

vcgm = Vcgencmd()
temp = vcgm.measure_temp()
clock = vcgm.measure_clock('arm')
volts = vcgm.measure_volts('core')

file = open(FILENAME, 'w')
file.write('{}\n{}\n{}'.format(temp, clock, volts))
file.close()