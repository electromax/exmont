const https = require('https');

function STAMP() {
    this.bid = 0;
    this.ask = 0;
    this.name = 'BitStamp';
    this.idx = 1;
    this.updated = new Date(2000, 1, 1);
    this.sell_make = "";
    this.sell_take = "";
    this.buy_make = "";
    this.buy_take = "";
    this.timeout = 3000;
    try {
        this.update();
    } catch (e) {
        console.log(e);
        setTimeout(this.update.bind(this), this.timeout);
    }
}

STAMP.prototype.update = function() {
    var self = this;
    var options = {
        host: 'www.bitstamp.net',
        path: '/api/ticker/',
        port: 443,
        method: 'GET'
    };

    callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            var data = JSON.parse(str);
            self.bid = parseFloat(data.bid);
            self.ask = parseFloat(data.ask);
            self.buy_take = (self.ask - self.idx) / self.idx * 100 + 0.25;
            self.sell_take = (self.bid - self.idx) / self.idx * 100 - 0.25;
            var buy_make = self.bid + 0.01;
            var sell_make = self.ask - 0.01;
            self.buy_make = (buy_make - self.idx) / self.idx * 100 + 0.25;
            self.sell_make = (sell_make - self.idx) / self.idx * 100 - 0.25;
            self.updated = new Date();
        });
    }

    https.request(options, callback).end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = STAMP;