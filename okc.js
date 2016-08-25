const https = require('https');

function OKC() {
    this.bid = 0;
    this.ask = 0;
    this.name = 'OKCoin';
    this.idx = 1;
    this.updated = new Date(2000, 1, 1);
    this.sell_make = "";
    this.sell_take = "";
    this.buy_make = "";
    this.buy_take = "";
    this.timeout = 2000;
    try {
        this.update();
    } catch (e) {
        console.log(e);
        setTimeout(this.update.bind(this), this.timeout);
    }
}

OKC.prototype.update = function() {
    var self = this;
    var options = {
        host: 'www.okcoin.com',
        path: '/api/v1/ticker.do?symbol=btc_usd',
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
            self.bid = parseFloat(data.ticker.buy);
            self.ask = parseFloat(data.ticker.sell);
            self.buy_make = ((self.bid + 0.01) * 1.005 - self.idx) / self.idx * 100;
            self.sell_make = ((self.ask - 0.01) / 1.005 - self.idx) / self.idx * 100;
            self.buy_take = (self.ask * 1.005 - self.idx) / self.idx * 100;
            self.sell_take = (self.bid / 1.005 - self.idx) / self.idx * 100;
            self.updated = new Date();
        });
    }

    https.request(options, callback).end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = OKC;