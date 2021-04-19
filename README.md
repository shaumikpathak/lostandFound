This project helps UC Davis students and falculty to find the lost items in school 
or adding the found items in this web app. The technique Sign in with google and loading google maps based on the instruction of Professor Nina Amenta.

### <-- Public
Include 2 files: index.html and not_signed_in.html
It helps to check the user is logged in with UCD email address. If not, it requires to log in to go to the next step by going to not_signed_in.html. 
Then it count down the number and redirect to index.html to login again.

### <-- User
After login with UCD email. It will direct to mainpage.html and start using the web app.
Includes all of screens in the project. Helps the finder, seekers to post or find the lost items. Also searching the lost items in the system.
It also has reset.css, displayScript.js, script.js, and style.css files.

### <-- .env
It is used to store the API key, CLIENT_ID, CLIENT_SECRET, ECS162KEY. Those keys are used for google API for sign in with google, loading google map, 
and uploading image onto Ecs162.org with port number

### <-- LostAndFound.db
It is the sqlite database for storing useful information like details about the .

### <-- server.js
Used node to implement the server side handling using AJAX POST GET requests. 

Note:
----
This final project is not done yet because we cannot load the data to display on screen 9 and 10. 
The database and everything works now. Sometimes, Glitch doesn't work is a trouble with our team.