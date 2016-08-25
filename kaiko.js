const https = require('https');

function KAIKO(index_acceptors) {
    this.timeout = 2000;
    this.index_acceptors = index_acceptors;
    try {
        this.update();
    } catch (e) {
        console.log(e);
        setTimeout(this.update.bind(this), this.timeout);
    }
}

KAIKO.prototype.update = function() {
    var self = this;

    var options = {
        host: 'api.kaiko.com',
        path: '/v1/indices/tickers',
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
            self.idx = data.btcusd.us.last;
            for (var i = 0; i < self.index_acceptors.length; i++)
                self.index_acceptors[i].idx = self.idx;
        });
    }

    var req = https.request(options, callback);
    req.end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = KAIKO;