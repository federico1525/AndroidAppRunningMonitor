/**
 * Provides the ability for your Android application to know when it is running
 * and when it has been stopped. The term "running" means that at least one
 * Activity/Window is being displayed, whereas the term "stopped" means that
 * none of the Activities/Windows are being displayed.
 *
 * Sample usage:
 *     // Callbacks to get notified about the state of the app.
 *     var appStartedCB = function() {
 *         Ti.API.info('*** APP IS RUNNING ***');
 *     };
 *     var appStoppedCB = function() {
 *         Ti.API.info('*** APP IS STOPPED ***');
 *     };
 * 
 *     // Load the module.
 *     var AndroidAppRunningMonitor = require('AndroidAppRunningMonitor').AndroidAppRunningMonitor;
 *     androidMonitor = new AndroidAppRunningMonitor(appStartedCB, appStoppedCB);
 * 
 *     // Create and register any Windows.
 *     var win1 = Ti.UI.createWindow({
 *         title:'Window 1', backgroundColor:'#fff', fullscreen:true
 *     });
 *     var win2 = Ti.UI.createWindow({
 *         title:'Window 2', backgroundColor:'#fff', fullscreen:true
 *     });
 *     androidMonitor.registerWindow(win1);
 *     androidMonitor.registerWindow(win2);
 *
 * @author Patrick Seda
 */
exports.AndroidAppRunningMonitor = function(appStartedCB, appStoppedCB) {
	var OPEN = 200,
		CLOSED = 400,
		states = {},
		numWindows = 0;
	
	// Register a Window for tracking and attach event listeners.
	var registerWindow = function(tiWindow) {
		if (Ti.Platform.osname !== 'android') {
			Ti.API.error('ERROR: Cannot register ' + Ti.Platform.osname + ' Window, NOT monitoring state.');
			return;
		}
		
		// Create an arbitrary name for internal tracking.
		var winName = 'window_' + (++numWindows);
		states[winName] = CLOSED;
		
		tiWindow.addEventListener('open', function(e) {
			updateState(winName, 'open');
			['resume', 'stop'].forEach(function(e) {
				tiWindow.activity.addEventListener(e, function() {
					updateState(winName, e);
				});
			});
		});
	};
	
	var countOpenWindows = function() {
		var numOpen = 0;
		for (var winName in states) {
			if (states[winName] === OPEN) {
				++numOpen;
			}
		};
		return numOpen;
	};
	
	var updateState = function(winName, event) {
		var numOpenBefore = countOpenWindows();
		if (winName && event) {
			if ((event === 'open') || (event === 'resume')) {
				states[winName] = OPEN;
			} else if ((event === 'stop'))  {
				states[winName] = CLOSED;
			}
		}
		var numOpenAfter = countOpenWindows();
		if ((numOpenBefore === 0) && (numOpenAfter > 0)) {
			// The first window has been opened.
			appStartedCB && appStartedCB.call(null);
		} else if ((numOpenBefore > 0) && (numOpenAfter === 0)) {
			// The last window has been closed.
			appStartedCB && appStoppedCB.call(null);
		}
	};
	
	// Public API.
	return {
		registerWindow : registerWindow
	};
};
