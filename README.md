# Remote thermometer for Raspberry Pi Zero with DHT11

This is the result of my small project to create a remote thermometer to monitor the temperature in my garage and display collected data on a simple webpage. To make this I used the cheapest Raspberry Pi Zero W and DHT11 thermometer, but you can use any other Single-board computer or thermometer (such as DHT22).

## Configuration - How to connect everything?

Firstly, you need your raspberry Pi and a micro USB charger. [Take a look](https://components101.com/sensors/dht11-temperature-sensor) at the DHT11 pin layout. Next, you need to connect the Vcc input to the 3.3V output on your Raspberry Pi and the ground to the GND input. At the end connect the second data Pin to any GPIO on your computer (I chose the 14'th Pin) and to the Vcc input with a 5K resistor (like in this [document](https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf)). Now you are ready to start the installation.

## Installation - How to configure everything?

### Other components

Put all the files from src to the home folder on your Raspberry Pi. Now you need to install a few other components.

You will need:

- Python 3.x
- Node.js 16.x
- DHT library

To install python just type

```bash
sudo apt update && sudo apt install python3 -y
```

To install node.js 16.x on older Raspberries like 1A, 1B or Zero which are based on ARMv6 architecture you need to follow [these scripts](https://github.com/sdesalas/node-pi-zero).

On newer pi's you can just type:

```bash
sudo apt update && sudo apt install nodejs -y
```

To install DHT library provided by adadruit you need to type:
```bash
pip3 install adafruit-circuitpython-dht
sudo apt-get install libgpiod2
```

Now you need to configure crontabs. By default my device will log data to history every hour and update "live" data every 10 minutes (it is done this way because reading data from DHT may take up to a few seconds and we don't want to wait so long on every page refresh).

To set this behaviour type:

```bash
crontab -e 
```

and select your favourite editor. After that put these two lines at the end of file  (instead of pi put your username):

```bash
0 */1 * * * /home/pi/logger.py & // <- Add new entries to history files every hour
*/10 * * * * /home/pi/dht_instant.py & // <- Update live temperature
```

### Files from this project

Now take a look at the scripts from this repository. First, make *.py files executable.

```bash
sudo chmod +x logger.py
sudo chmod +x dht_instant.py
```

In the file dht_instant.py, you can choose the path to the live data file and you can change GPIO PIN which you chose to connect to DHT11. You can also change the function name to DHT22 in order to use that device.

In the file logger.py, you can choose paths to the live data file and the history data file and you can set a maximal number of entries in the history file.

Last but not least, we have to run the HTTP server. Before that, I strongly suggest setting static IP addressing for your Raspberry.

The only thing we need to do is run the server, by typing:

```bash
node server.js &
```

Now our thermometer should be accessible through the web browser on the address http://192.168.x.xxx:3000/.
The exact address could be found by typing:

```bash
ifconfig
```

## To-Do

In the future, I want to add a simple script that will do most of the configuration automatically.

## License

Licensed under the [MIT License](./LICENSE).
