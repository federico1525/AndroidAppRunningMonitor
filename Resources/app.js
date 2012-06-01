/**
 * Sample application to demonstrate the AndroidAppRunningMonitor module.
 */

var appStartedCB = function() {
	Ti.API.info('*** APP IS RUNNING ***');
};
var appStoppedCB = function() {
	Ti.API.info('*** APP IS STOPPED ***');
};
var AndroidAppRunningMonitor = require('AndroidAppRunningMonitor').AndroidAppRunningMonitor;
appRunningMonitor = new AndroidAppRunningMonitor(appStartedCB, appStoppedCB);


var thirdWindow = Ti.UI.createWindow({
	title : 'Window 3',
	backgroundColor : '#b86',
	fullscreen : true
});
appRunningMonitor.registerWindow(thirdWindow);

var secondWindow = Ti.UI.createWindow({
	title : 'Window 2',
	backgroundColor : '#6b8',
	fullscreen : true
});
appRunningMonitor.registerWindow(secondWindow);

var homeWindow = Ti.UI.createWindow({
	title : 'Window 1',
	backgroundColor : '#68b',
	fullscreen : true,
	exitOnClose : true
});
appRunningMonitor.registerWindow(homeWindow);

var button2 = Ti.UI.createButton({
	title : 'Open Window 3',
	height : 40, width : 200, top : 100, left : 250
});
button2.addEventListener('click', function() {
	thirdWindow.open();
});
secondWindow.add(button2);

var button1 = Ti.UI.createButton({
	title : 'Open Window 2',
	height : 40, width : 200, top : 100, left : 50
});
button1.addEventListener('click', function() {
	secondWindow.open();
});

homeWindow.add(button1);
homeWindow.open();
