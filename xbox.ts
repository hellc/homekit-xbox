import * as HAS from 'has-node';

const consoleIpAddress = '<INSERT IPADDRESS HERE. Ex.: 192.168.0.5>';
const consoleLiveId = '<INSERT LIVE ID HERE> Ex.: FD0############';

let config = new HAS.Config(
    'XBOX', //accessory name
    '82:E8:B2:63:A1:1F', // custom mac address
    HAS.categories.switch, __dirname + '/xboxs.json', 
    10201, //custom port
    '800-80-800'); //auth number

let server = new HAS.Server(config);

let xbox = new HAS.Accessory(1);

let xboxIdentify = HAS.predefined.Identify(1, undefined, (value, callback) => {
        console.log('Xbox Identify', value);
        callback(HAS.statusCodes.OK);
    }),

    xboxManufacturer = HAS.predefined.Manufacturer(2, 'Microsoft'),
    xboxModel = HAS.predefined.Model(3, 'ONE S'),
    xboxName = HAS.predefined.Name(4, 'XBOX'),
    xboxSerialNumber = HAS.predefined.SerialNumber(5, 'ABCDEFGHIJ2'),
    xboxFirmwareVersion = HAS.predefined.FirmwareRevision(6, '1.0.0');
    xbox.addServices(HAS.predefined.AccessoryInformation(1, [xboxIdentify, xboxManufacturer, xboxModel, xboxName, xboxSerialNumber, xboxFirmwareVersion]));

let on = HAS.predefined.On(1, false, (value, callback) => {
    console.log('Xbox Status', value);
    callback(HAS.statusCodes.OK);

    if (value) {
        var XboxOn = require('xbox-on');
        var xboxOn = new XboxOn(consoleIpAddress, consoleLiveId);

        var options = {
            tries: 5,
            delay: 1000,
            waitForCallback: false
        };
        
        xboxOn.powerOn(options);
    }
});

xbox.addServices(HAS.predefined.Switch(2, [on]));

server.addAccessory(xbox);

//server.onIdentify will be used only when server is not paired, If server is paired identify.onWrite will be used
server.onIdentify = xboxIdentify.onWrite;

//Starts the server
server.startServer();
