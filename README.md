# radar Precipitation => Rain Radar City
This app shows you the raining clouds (ionic).

To get this project working (ionic already installed with its dependencies) :
- Download or clone it clocally.
-rund these commands:
bower install
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-geolocation
cordova plugin add cordova-plugin-globalization
- And these commands for translations :
npm install -g grunt-cli
npm install grunt --save-dev
npm install grunt-angular-gettext --save-dev
grunt
open template.pot and translate, creating the fr.po file
grunt
