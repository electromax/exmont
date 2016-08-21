const https = require('https');

function MEX(index_acceptors) {
    this.bid = 0;
    this.ask = 0;
    this.name = 'Bitmex';
    this.idx = 1;
    this.updated = new Date(2000, 1, 1);
    this.sell_make = "";
    this.sell_take = "";
    this.buy_make = "";
    this.buy_take = "";
    this.timeout = 3500;
    this.index_acceptors = index_acceptors;
    try {
        this.update();
    } catch (e) {
        console.log(e);
        setTimeout(this.update.bind(this), this.timeout);
    }
}

MEX.prototype.update = function() {
    var self = this;

    var options = {
        host: 'www.bitmex.com',
        path: '/api/v1/instrument?count=100&start=0&reverse=false',
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
            for (var k = 0; k < data.length; k++) {
                var symbol = data[k].symbol;
                if (symbol == 'XBTUSD') {
                    self.bid = data[k].bidPrice;
                    self.ask = data[k].askPrice;
                    self.buy_make = ((self.bid + 0.01) * 0.99975 - self.idx) / self.idx * 100;
                    self.sell_make = ((self.ask - 0.01) / 0.99975 - self.idx) / self.idx * 100;
                    self.buy_take = (self.ask * 1.00075 - self.idx) / self.idx * 100;
                    self.sell_take = (self.bid / 1.00075 - self.idx) / self.idx * 100;
                    self.idx = data[k].indicativeSettlePrice;
                    for (var i = 0; i < self.index_acceptors.length; i++)
                        self.index_acceptors[i].idx = self.idx;
                    self.updated = new Date();
                }
            }
        });
    }

    var req = https.request(options, callback);
    req.end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = MEX;