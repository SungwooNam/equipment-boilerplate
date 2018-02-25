var log4js = require('log4js');

class Log {
    constructor() {

        try {
            require('fs').mkdirSync('./log');
        } catch (e) {
            if (e.code != 'EEXIST') {
                console.error("Could not set up log directory, error was: ", e);
                process.exit(1);
            }
        }

        log4js.addLayout('json', function (config) {
            return function (logEvent) {
                var table = document.getElementById("logTable");
                if (table != null) {
                    var row = document.createElement("tr");
                    row.innerHTML =
                        `<td>${logEvent.startTime.toLocaleString()}</td>
                        <td>${logEvent.categoryName}</td>
                        <td>${logEvent.data}</td>`;
                    table.append(row);
                }

                return "";
            }
        });
        log4js.configure('./config/log4js.json');
    }

    getLogger( category )
    {
        return log4js.getLogger( category );
    }
    
}

module.exports = Log;