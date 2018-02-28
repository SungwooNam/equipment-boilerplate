const Log = require("./log")
const log = new Log().getLogger("index");

const Tab = require('./tab');
const tab = new Tab();

const dgram = require('dgram');
const comm = dgram.createSocket('udp4');

comm.on('error', (err) => {
  log.error(`comm error:\n${err.stack}`);
  comm.close();
});

comm.on('message', (msg, rinfo) => {
  var jm = JSON.parse(msg);

  if (jm != null && jm.cmd == 'ioUpdate') {
    // log.info(`ioUpdate @${jm.address} : ${jm.value}`);

    if (jm.address == 0x300) {
      var inport = document.getElementById('ioIn').getElementsByTagName('input');
      for (var i = 0; i < inport.length; ++i) {
        inport[i].checked = jm.value[i] == '1' ? true : false;
      }
      return;
    }
    else if (jm.address == 0x400) {
      var inport = document.getElementById('ioOut').getElementsByTagName('input');
      for (var i = 0; i < inport.length; ++i) {
        inport[i].checked = jm.value[i] == '1' ? true : false;
      }
      return;
    }
  }

  if (jm != null && jm.cmd == 'servoUpdate') {

    var ypos = -parseInt(jm.value[0]);
    var xpos = parseInt(jm.value[1]);

    overview_stage.setAttribute( "transform", `translate(0 ${ypos}) rotate(0 0 0)`);
    overview_shift.setAttribute( "transform", `translate(${xpos} 0 ) rotate(0 0 0)`);
    return;
  }
 
  log.info(`comm got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

comm.on('listening', () => {
  const address = comm.address();
  log.info(`comm listening ${address.address}:${address.port}`);
});

comm.bind(41234);

btnAutorun.onclick = (event) => { tab.select(event, 'autorun'); log.debug('autorun clicked'); }
btnManual.onclick = (event) => { tab.select(event, 'manual'); log.debug('manual clicked'); }
btnLog.onclick = (event) => { tab.select(event, 'log'); log.debug('log clicked'); }
btnAutorun.click();

var mouseDown = 0;

var v = overview.getAttribute( "viewBox").split(" ");
var viewBox = {
  x: parseInt(v[0]),
  y: parseInt(v[1]),
  width: parseInt(v[2]),
  height: parseInt(v[3]),
}

overview.onmousemove = (event) => {
  if (mouseDown == 1) {
    viewBox.x += event.movementX;
    viewBox.y += event.movementY;
    overview.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
  }
}

overview.onmousewheel = (event) => {
  var z = -event.deltaY / 10;
  viewBox.x += z;
  viewBox.y += z;
  viewBox.width -= z*2;
  viewBox.height -= z*2;
  overview.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
}

overview.onmousedown = (event) => {
  mouseDown = event.which;
}

overview.onmouseup = (event) => {
  mouseDown = 0;
}



btnRun.onclick = (event) => {
  comm.send(
    '"cmd":"runEquipment"',
    50000, 'localhost',
    (err) => {
      log.error("Failed to send runEquipment");
    });
}

btnStop.onclick = (event) => {
  comm.send(
    '"cmd":"stopEquipment"',
    50000, '127.0.0.1',
    (err) => {
      log.error("Failed to send stopEquipment");
    });
}
