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
 
        log4js.addLayout('showImmediate', function (config) {
            return ( log ) => {
                var table = document.getElementById("logTable");
                if (table != null) {
                    var row = document.createElement("tr");
                    row.innerHTML =
                        `<td>${log.startTime.toLocaleString()}</td>
                        <td>${log.categoryName}</td>
                        <td>${log.data}</td>`;
                    table.append(row);
                }
            }
        });
        log4js.configure('./config/log4js.json');
    }

    getLogger( category ) {
        return log4js.getLogger( category );
    }

    addLog(time, severity, category, msg )
    {
        var table = document.getElementById("logTable");
        if ( table != null) {
            var row = document.createElement("tr");
            row.innerHTML =
                `<td>${time}</td>
                <td>${category}</td>
                <td>${msg}</td>`;
            table.append(row);
        }
    } 
}

module.exports = Log;