var log4js = require('log4js');
var log = setupLog();

btnAutorun.onclick = (event) => { openTab(event, 'autorun'); log.debug('autorun clicked'); }
btnManual.onclick = (event) => { openTab(event, 'manual'); log.debug('manual clicked'); }
btnLog.onclick = (event) => { openTab(event, 'log'); log.debug('log clicked'); }

function openTab(evt, tabId) {
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  var tablinks = document.getElementsByClassName("tablinks");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabId).style.display = "block";
  evt.currentTarget.className += " active";
}


function setupLog() {
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

        var td0 = document.createElement("td");
        var td0text = document.createTextNode(logEvent.startTime.toLocaleString());
        td0.appendChild(td0text);
        row.appendChild(td0);

        var td1 = document.createElement("td");
        var td1text = document.createTextNode(logEvent.categoryName);
        td1.appendChild(td1text);
        row.appendChild(td1);

        var td2 = document.createElement("td");
        var td2text = document.createTextNode(logEvent.data);
        td2.appendChild(td2text);
        row.appendChild(td2);

        table.appendChild(row);
      }

      return "";
    }
  });
  log4js.configure('./config/log4js.json');

  var log = log4js.getLogger("log");
  return log;
}