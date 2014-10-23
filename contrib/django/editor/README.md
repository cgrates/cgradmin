# Install

- extract editor ip into project root directory
- add 'editor' app to the INSTALLED_APPS section
- add url(r'', include('editor.urls'), name='editor') to the main urls.py file
- enjoy!

P.S. If you need to include editor url at a different path than you must also edit static/app/js/services.js file and change .value('root_url', '/') to reflect your path

# Details
Most of the action is done by angular and the `call` view from the editor app.
The only template file contains an empty redirect to the static index.html file. Your project will most likely not use this file at all as you probably have another front page that will link to the angular page.
For a seamless integration with the base template of your django project the general look and feel and the menus of the angular index.html should be aligned with the base template file.
