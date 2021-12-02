const fs = require ('fs');
const http = require ('http');

const maxHistoryEntries = 24;

function getDateTime(isoDate) {
    let hours = isoDate.getHours();
    if (hours < 10) hours = '0' + hours;
    let minutes = isoDate.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    let date = isoDate.getDate();
    if (date < 10) date = '0' + date;
    let month = isoDate.getMonth() + 1;
    if (month < 10) month = '0' + month;

    return `${date}-${month}-${isoDate.getFullYear()} ${hours}:${minutes}`;
}

function generateHistory(data) {
    let html = '';

    for (let k of data) {
        html+=`<div class="history-item">\n`;
        html+=`<div class="history-item-top">\n`;
        html+=`<span class="histemp">${k[1]}°C</span>\n`;
        html+=`<span class="hishumidity">${k[2]}%</span>\n`;
        html+=`</div>\n`;
        html+=`<div class="hisdate">${getDateTime(new Date(k[0]))}</div>\n`;
        html+=`</div>\n`;
    }

    return html;
}

http.createServer((req, res) => {
    (async function () {

        if (req.url === '/') {
            let html = await fs.promises.readFile('index.html', 'utf-8');
            let data = await fs.promises.readFile('data_now.txt', 'utf-8');
            let history_data = await fs.promises.readFile ('temps.txt', 'utf-8');

            data = data.split('\n');
            const last_update = getDateTime(new Date(data[2]));

            history_data = history_data.split('\n').splice(0, maxHistoryEntries);
            for (let i = 0; i < history_data.length; i++) {
                history_data[i] = history_data[i].split(' ');
            }

            html = html.replace('{{temperature}}', data[0]).replace('{{humidity}}', data[1]).replace('{{date}}', last_update).replace('{{history}}', generateHistory(history_data));
            res.setHeader('Content-type', 'text/html; charset="utf-8"');
            res.end(html);
        } else if (req.url === '/style.css') {
            const style = await fs.promises.readFile('style.css', 'utf-8');
            res.setHeader('Content-type', 'text/css; charset="utf-8"');
            res.end(style);
        }
        
    })();
}).listen(3000);
