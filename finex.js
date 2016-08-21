const https = require('https');

function FINEX() {
    this.bid = 0;
    this.ask = 0;
    this.name = 'Bitfinex';
    this.idx = 1;
    this.updated = new Date(2000, 1, 1);
    this.sell_make = "";
    this.sell_take = "";
    this.buy_make = "";
    this.buy_take = "";
    this.timeout = 1500;
    try {
        this.update();
    } catch (e) {
        console.log(e);
        setTimeout(this.update.bind(this), this.timeout);
    }
}

FINEX.prototype.update = function() {
    var self = this;
    var options = {
        host: 'api.bitfinex.com',
        path: '/v1/pubticker/BTCUSD',
        port: 443,
        method: 'GET'
    };

    callback = function(response) {
        var str = '';

        response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('end', function() {
            var data = JSON.parse(str);
            self.bid = parseFloat(data.bid);
            self.ask = parseFloat(data.ask);
            self.buy_make = ((self.bid + 0.01) * 1.001 - self.idx) / self.idx * 100;
            self.sell_make = ((self.ask - 0.01) / 1.001 - self.idx) / self.idx * 100;
            self.buy_take = (self.ask * 1.002 - self.idx) / self.idx * 100;
            self.sell_take = (self.bid / 1.002 - self.idx) / self.idx * 100;
            self.updated = new Date();
        });
    }

    var req = https.request(options, callback);
    req.end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = FINEX;