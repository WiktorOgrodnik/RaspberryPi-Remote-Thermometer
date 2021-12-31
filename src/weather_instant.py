#!/usr/bin/env python

from datetime import datetime
import requests
import sys

FILENAME = './weather_now.txt' # File to save live data

city = 'YOUR_CITY'
api = 'YOUR_API'
query = {'q': city, 'appid': api}
response = requests.get("http://api.openweathermap.org/data/2.5/weather", params=query)

data = response.json()
temperature_c = round(float(data['main']['temp']) - 273.15, 1)
humidity = float(data['main']['humidity'])

if len(sys.argv) == 2 and sys.argv[1] == '-temperature':
    print (temperature_c)
elif len(sys.argv) == 2 and sys.argv[1] == '-humidity':
    print(humidity)
elif len(sys.argv) == 1:
    file = open(FILENAME, 'w')
    file.write('{}\n{}\n{}'.format(temperature_c, humidity, datetime.now().isoformat()))

file.close()