# MacrosEngine Dashboard App

This is tiny crm/License Control app using Node.js, Express, Passport, Mongoose, EJS and some other packages.

### Version: 1.0.0

### Usage

```sh
$ npm install
```

```sh
$ npm start
# Or run with Nodemon
$ npm run dev

# Visit http://localhost:5000
```

### App Configuration

create a .env file with the following variables

```sh
# Main configurations
# your app name
TEXTLOGO=ME Dashboard
# the port of your app
PORT=5000
#mangodb uri, local or from atls
MANGODBURI=mongodb+srv://user:user@cluster0-cc.mongodb.net/test?retryWrites=true&w=majority
# change your url and app name for footer credential
MAINURL=https://www.macrosengine.com/
SITENAME=MacrosEngine
#customize the look of your app
MDBOOTSTRAP=yes
BOOTSWATCH=cosmo
#change the support email
SUPPORT_EMAIL=support@email.com
# Email Configuration , use smtp/mailgun, right now only smtp is supportted
EMAIL=smtp
# SMTP Configurations
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=465
SMTP_SECURE=true
SMTP_AUTH_USER=macosengine@mg.domain.com
SMTP_AUTH_PASS=123456789
SMTP_FROM_EMAIL=macrosengine@mg.domain.com
SMTP_FROM_NAME=MacrosEngine
# BACKUPS blob/base64
BACKUP=base64

```
