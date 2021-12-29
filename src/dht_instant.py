#!/usr/bin/env python

# Some code below is provided by Adafruit https://learn.adafruit.com/dht-humidity-sensing-on-raspberry-pi-with-gdocs-logging/python-setup

# SPDX-FileCopyrightText: 2021 ladyada for Adafruit Industries
# SPDX-License-Identifier: MIT

from datetime import datetime
from time import sleep
import sys
import board
import adafruit_dht

device = 'DHT11'

# Initial the dht device, with data pin connected to:
dhtDevice11 = adafruit_dht.DHT11(board.D14)
dhtDevice22 = adafruit_dht.DHT22(board.D14)

dhtDevice = dhtDevice11

if device == 'DHT22':
    dhtDevice = dhtDevice22 

# you can pass DHT22 use_pulseio=False if you wouldn't like to use pulseio.
# This may be necessary on a Linux single board computer like the Raspberry Pi,
# but it will not work in CircuitPython.
# dhtDevice = adafruit_dht.DHT22(board.D18, use_pulseio=False)

FILENAME = '/home/pi/data_now.txt' # File to save live data

while True:
    try:
        # Print the values to the serial port
        temperature_c = dhtDevice.temperature
        humidity = dhtDevice.humidity

        if len(sys.argv) == 2 and sys.argv[1] == '-temperature':
            print (temperature_c)
        elif len(sys.argv) == 2 and sys.argv[1] == '-humidity':
            print(humidity)
        elif len(sys.argv) == 1:
            file = open(FILENAME, 'w')
            file.write('{}\n{}\n{}'.format(temperature_c, humidity, datetime.now().isoformat()))
            file.close()
        break

    except RuntimeError as error:
        # Errors happen fairly often, DHT's are hard to read, just keep going
        sleep(2.0)
        continue
    except Exception as error:
        dhtDevice.exit()
        raise error