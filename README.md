# Rain Radar City
This app shows you the raining clouds.

To get this project working (ionic already installed with its dependencies) :
- Download or clone it clocally.
- rund these commands:
- bower install
- cordova plugin add cordova-plugin-whitelist
- cordova plugin add cordova-plugin-geolocation
- cordova plugin add cordova-plugin-globalization

To add a translations:
- npm install -g grunt-cli
- npm install grunt --save-dev
- npm install grunt-angular-gettext --save-dev
- grunt
- open template.pot and translate, this will create the fr.po file
- grunt
