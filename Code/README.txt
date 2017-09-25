The structure of the Code folder is as follows:
1-api: contains all the code of the web api/backend
	1-config: contains application configuration files
	2-models: contains database entity modules(each represents a mongo collection)
	3-routes: represent routes in the web api and are the controllers for our web api
	4-services: contains miscelaneous reusable "classes" that are used throughout the web api controllers
2-deployment: module that combines and minimizes the applications javascript and css files at server startup time and places them in the Code/webapp/distrib folder
	1-gulpfile.js: contains the gulp tasks that perform the combination and minimization, gets called by the server.js script
	2-package.json: npm package information for our deployment nodejs module
3-webapp: contains all of the applications frontend(actual website), html, css, frontend js libraries, angular js code, etc...	
	1-css: contains our custom css
	2-features: contains the html for most pages as well as almost all the angular code organized per feature(one feature per folder), this is the bulk of our frontend code
	3-img: contains images used accross the website
	4-lib: third party frontend javascript libraries
	5-app.js: parent module to all of our other angularjs modules(this is the main angular module of our application)
	6-index.html: base html template for our website
	7-routes.js: contains all the routing information for our website, this configures the "ui.router" module
4-certificateRenewal.bash: this script is deployed to the vip-dev and prod servers in the /var/www folder and is executed periodically by a cron job to renew the https certificates automatically
5-install.bat and install.bash: this scripts install the web application(only run npm install where necessary really)
6-package.json: npm package information for our main nodejs module
7-server.js: our main application script, this configures and starts the express web server for hosting our application