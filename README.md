# Remote thermometer for Raspberry PI Zero with DHT11

This is the result of my small project to create a remote thermometer to monitor the temperature in my garage and display collected data on a simple webpage. To make this I used the cheapest Raspberry Pi Zero W and DHT11 thermometer, but you can use any other Single-board computer or thermometer (such as DHT22).

## Configuration - How to connect everything?

Firstly, you need your raspberry Pi and micro USB charger. [Take a look](https://components101.com/sensors/dht11-temperature-sensor) at the DHT11 pin layout. Next, you need to connect Vcc input to 3.3V output on your Raspberry Pi and the ground to the Gnd input. At the end connect the second data Pin to any GPIO on your computer (I chose 14'th Pin) and to Vcc input with 5K resistor (like in that [document](https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf])). Now you can ready to start installation.

## Installation - How to configure everything?

### Other components

Put all files from src folder to home folder on your Raspberry Pi. Now you need to install a few other components.

You will need:

- Python 3.x
- Node.js 16.x

To install python just type

```bash
sudo apt update && sudo apt install python3 -y
```

To install node.js 16.x on older Raspberries like 1A, 1B or Zero wchich are based on ARMv6 architechture you need to follow [those scripts](https://github.com/sdesalas/node-pi-zero).

On newer pi's you can just type:

```bash
sudo apt update && sudo apt install nodejs -y
```

Now you need to configure crontabs. By default my device log data to history every hour and updating "live" data every 10 minutes (it is done this way, becouse reading data from DHT may take up to a few seconds and we don't want to waiting so long on every page refresh).

To set this behaviour type:

```bash
crontab -e 
```

and select your favourite editor. After that on the end of file put this two lines (instead of pi put your username):

```bash
0 */1 * * * /home/pi/logger.py & // <- Add new entries to history files every hour
*/10 * * * * /home/pi/dht_instant.py & // <- Update live temperature
```

### Files from this project

Now take a look at scripts from this repository. First, make *.py file executable.

```bash
sudo chmod +x logger.py
sudo chmod +x dht_instant.py
```

In the file dht_instant.py, you can choose the path to the live data file and you can change GPIO PIN which you choose to connect to DHT11. You can also change the function name to DHT22 to use that device.

In the file logger.py, you can choose paths to the live data file and the history data file and you can set a maximal number of entries in the history file.

The last, but not least. Now we have to run http server. Before that I strongly suggest to set static IP adressing for your Raspberry.

The only one thing we need to do is run the server, by typing:

```bash
node server.js &
```

Now our thermometer should by accessible through web browser on adress http://192.168.x.xxx:3000/.
The exact adress could be find by typing:

```bash
ifconfig
```

## To-Do

In the future I want to add a simple script that will do most of the configuration automatically.

## License

Licensed under the [MIT License](./LICENSE).
