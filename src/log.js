var log4js = require('log4js');
var log = setupLog();

document.body.addEventListener('click', () => {
     log.debug( 'Clicked body')
    
      var logTab = tabs.getTab(1);
})

btnHello.onclick = _ => {
    console.log('Hello'); 
    log.debug( 'Clicked Good')
}
    

function setupLog()
{
  try {
    require('fs').mkdirSync('./log');
  } catch (e) {
    if (e.code != 'EEXIST') {
      console.error("Could not set up log directory, error was: ", e);
      process.exit(1);
    }
  }

  log4js.addLayout('json', function(config) {
    return function(logEvent) 
    {
      var table = document.getElementById("logTable");
      if( table != null)
      {
        var row = document.createElement("tr");

        var td0 = document.createElement("td");
        var td0text = document.createTextNode( logEvent.date );
        td0.appendChild( td0text );
        row.appendChild( td0 );

        var td1 = document.createElement("td");
        var td1text = document.createTextNode( logEvent.category );
        td1.appendChild( td1text );
        row.appendChild( td1 );

        var td2 = document.createElement("td");
        var td2text = document.createTextNode( logEvent.message  );
        td2.appendChild( td2text );
        row.appendChild( td2 );

        table.appendChild( row );
      } 

      return ""; 
    }
  });
  log4js.configure('./config/log4js.json');

  var log = log4js.getLogger("log");
  return log;
}