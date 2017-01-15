const https = require('https');

function XBX(index_acceptors) {
    this.timeout = 2000;
    this.index_acceptors = index_acceptors;
    try {
        this.update();
    } catch (e) {
        console.log(e);
        setTimeout(this.update.bind(this), this.timeout);
    }
}

XBX.prototype.update = function() {
    var self = this;

    var options = {
        host: 'tradeblock.com',
        path: '/api/markets/xbx/',
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
            self.idx = data.xbx;
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

module.exports = XBX;