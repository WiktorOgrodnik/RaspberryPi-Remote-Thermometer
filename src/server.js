'use strict';

import fs from 'fs';
import http from 'http';

const maxHistoryEntries = 25;
const port = 3000;

function getDateTime(isoDate) {
    let hours = isoDate.getHours();
    let minutes = isoDate.getMinutes();
    let date = isoDate.getDate();
    let month = isoDate.getMonth() + 1;

    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (date < 10) date = '0' + date;
    if (month < 10) month = '0' + month;

    return `${date}-${month}-${isoDate.getFullYear()} ${hours}:${minutes}`;
}

http.createServer((req, res) => {
    (async () => {

        if (req.url === '/') {
            let html = await fs.promises.readFile('index.html', 'utf-8');
            let data = await fs.promises.readFile('data_now.txt', 'utf-8');
            let dataOutdoor = await fs.promises.readFile('weather_now.txt', 'utf-8');
            let history_data_indoor = await fs.promises.readFile('temps.txt', 'utf-8');
            let history_data_outdoor = await fs.promises.readFile('temps_outdoor.txt', 'utf-8');
            let computer_info = await fs.promises.readFile('pi_now.txt', 'utf-8');

            data = data.split('\n');
            const last_update = getDateTime(new Date(data[2]));

            dataOutdoor = dataOutdoor.split('\n');
            const last_update_outdoor = getDateTime(new Date(dataOutdoor[2]));

            computer_info = computer_info.split('\n');

            history_data_indoor = history_data_indoor.split('\n').splice(0, maxHistoryEntries);
            for (let i = 0; i < history_data_indoor.length; i++) {
                history_data_indoor[i] = history_data_indoor[i].split(' ');
            }

            history_data_outdoor = history_data_outdoor.split('\n').splice(0, maxHistoryEntries);
            for (let i = 0; i < history_data_outdoor.length; i++) {
                history_data_outdoor[i] = history_data_outdoor[i].split(' ');
            }

            let history_temp_indoor = [];
            let history_temp_outdoor = [];
            let history_date = [];

            let j = 0;
            for (j; j < history_data_indoor.length && j < history_data_outdoor.length; j++) {
                history_temp_indoor[j] = history_data_indoor[j][1];
                history_temp_outdoor[j] = history_data_outdoor[j][1];
                history_date[j] = getDateTime(new Date(history_data_indoor[j][0]));
            }

            while (j < history_data_indoor.length) {
                history_temp_indoor[j] = history_data_indoor[j][1];
                history_temp_outdoor[j] = undefined;
                history_date[j] = getDateTime(new Date(history_data_indoor[j][0]));
                j++;
            }

            while (j < history_data_outdoor.length) {
                history_temp_indoor[j] = undefined;
                history_temp_outdoor[j] = history_data_outdoor[j][1];
                history_date[j] = getDateTime(new Date(history_data_outdoor[j][0]));
                j++;
            }

            html = html.replace('{{temperature}}', data[0])
                        .replace('{{humidity}}', data[1])
                        .replace('{{date}}', last_update)
                        .replace('{{temperature-outdoor}}', dataOutdoor[0])
                        .replace('{{humidity-outdoor}}', dataOutdoor[1])
                        .replace('{{date-outdoor}}', last_update_outdoor)
                        .replace('{{histemp_in}}', history_temp_indoor.join(','))
                        .replace('{{histemp_out}}', history_temp_outdoor.join(','))
                        .replace('{{hisdate}}', history_date.join(','))
                        .replace('{{speed}}', +computer_info[1] / 1000000000)
                        .replace('{{proc_tmep}}', computer_info[0])
                        .replace('{{volts}}', computer_info[2]);

            res.setHeader('Content-type', 'text/html; charset="utf-8"');
            res.end(html);
        } else if (req.url === '/style.css') {
            const style = await fs.promises.readFile('style.css', 'utf-8');
            res.setHeader('Content-type', 'text/css; charset="utf-8"');
            res.end(style);
        } else if (req.url === '/img/rpi.png') {
            const img = await fs.promises.readFile('./img/rpi.png');
            res.setHeader('Content-type', 'image/png');
            res.end(img);
        } else if (req.url === '/chart.js') {
            const script = await fs.promises.readFile('./chart-min.js');
            res.setHeader('Content-type', 'text/javascript; charset="utf-8"');
            res.end(script);
        } else {
            res.writeHead(404);
            res.end('Error 404');
        }
        
    })();
}).listen(port);