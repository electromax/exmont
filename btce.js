const https = require('https');

function BTCE() {
    this.bid = 0;
    this.ask = 0;
    this.name = 'BTC-e';
    this.idx = 1;
    this.updated = new Date(2000, 1, 1);
    this.fee = 0.2;
    this.sell_make = "";
    this.sell_take = "";
    this.buy_make = "";
    this.buy_take = "";
    this.timeout = 1000;
    try {
        this.update();
    } catch (e) {
        console.log(e);
        setTimeout(this.update.bind(this), this.timeout);
    }
}

BTCE.prototype.update = function() {
    var self = this;
    var options = {
        host: 'btc-e.com',
        path: '/api/3/ticker/btc_usd',
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
            self.bid = data.btc_usd.sell;
            self.ask = data.btc_usd.buy;
            self.buy_take = (self.ask - self.idx) / self.idx * 100 + self.fee;
            self.sell_take = (self.bid - self.idx) / self.idx * 100 - self.fee;
            var buy_make = self.bid + 0.001;
            var sell_make = self.ask - 0.001;
            self.buy_make = (buy_make - self.idx) / self.idx * 100 + self.fee;
            self.sell_make = (sell_make - self.idx) / self.idx * 100 - self.fee;
            self.updated = new Date();
        });
    }

    https.request(options, callback).end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = BTCE;