const Log = require("./log")
const logView = new Log();
const log = logView.getLogger("index");

const Tab = require('./tab');
const tab = new Tab();

const dgram = require('dgram');
const comm = dgram.createSocket('udp4');

const Drawing = require("./drawing");
const overviewDrawing = new Drawing("overview");

comm.on('error', (err) => {
  log.error(`comm error:\n${err.stack}`);
  comm.close();
});

comm.on('message', (msg, rinfo) => {

  var packetType = msg.readUInt32LE(0);

  if (packetType == 0x6182) {
    var header = {
      type: packetType,
      length: msg.readUInt16LE(4),
      width: msg.readUInt16LE(6),
      height: msg.readUInt16LE(8),
      bpp: msg.readUInt16LE(10),
      regionX: msg.readUInt16LE(12),
      regionY: msg.readUInt16LE(14),
      regionWidth: msg.readUInt16LE(16),
      regionHeight: msg.readUInt16LE(18),
    };

    if (header.width == 160 && header.height == 120 && header.bpp == 32) {
      var canvas = document.getElementById("cameraImage");
      var context = canvas.getContext("2d");

      context.putImageData(
        new ImageData(
          new Uint8ClampedArray(msg.buffer, 20),
          header.regionWidth, header.regionHeight
        ),
        header.regionX, header.regionY,
        0, 0, header.regionWidth, header.regionHeight);
    }
    else {
      log.error(`Cannot support image with ${header.width}x${header.height}x${header.bpp}`);
    }

    return;
  }

  var jm = JSON.parse(msg);

  if (jm != null && jm.cmd == 'ioUpdate') {
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

    overview_stage.setAttribute("transform", `translate(0 ${ypos}) rotate(0 0 0)`);
    overview_shift.setAttribute("transform", `translate(${xpos} 0 ) rotate(0 0 0)`);
    return;
  }

  if (jm != null && jm.cmd == 'log') {
    logView.addLog(jm.time, jm.severity, "remote", jm.msg);
    return;
  }

  log.info(`comm got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

comm.on('listening', () => {
  const address = comm.address();
  log.info(`comm listening ${address.address}:${address.port}`);
});

comm.bind(41234);

btnAutorun.onclick = (event) => {
  tab.select(event, 'autorun');
  log.debug('autorun clicked');
}
btnManual.onclick = (event) => {
  tab.select(event, 'manual');
  log.debug('manual clicked');
}
btnLog.onclick = (event) => {
  tab.select(event, 'log');
  log.debug('log clicked');
}
btnAutorun.click();

btnRun.onclick = (event) => {
  comm.send(
    '{"cmd":"runEquipment"}',
    50000, 'localhost',
    (err) => {
      log.error("Failed to send runEquipment");
    });
}

btnStop.onclick = (event) => {
  comm.send(
    '{"cmd":"stopEquipment"}',
    50000, '127.0.0.1',
    (err) => {
      log.error("Failed to send stopEquipment");
    });
}

window.onload = function () {
  initCameraImage();
}

function initCameraImage() {
  var canvas = document.getElementById("cameraImage");
  var context = canvas.getContext("2d");

  var image = new Image();
  image.src = "./sunflower.png";
  image.onload = (arg) => {
    context.drawImage(image, 0, 0);
  };
}