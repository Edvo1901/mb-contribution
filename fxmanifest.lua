fx_version 'cerulean'
game 'gta5'
version '1.0'
author 'Maybe'
description 'A contribution script that made by Maybe'

client_scripts {
    "client/**/*",
}

shared_script {
    "config.js"
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
    "server/**/*",
}

ui_page 'web/build/index.html'

files {
    'web/build/index.html',
	'web/build/**/*',
}

lua54 'yes'