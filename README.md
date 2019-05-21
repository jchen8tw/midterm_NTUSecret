# NTU Secret
### Inspired by HKUST Secrets
### A true open-source and anonymous facebook page app
Demo: https://ntuhate-2df40.appspot.com/

facebook page: https://www.facebook.com/NTU-Secrets-358964794749086/

Project Link : https://github.com/jchen8tw/midterm_NTUSecret

A webbase application to publish/edit/delete your own anonymous posts. By simply using keyword filtering to accelerate the process of human rewiewing the posts.


> ❗️Please do not post illegal contents with this website


## Requirements for midterm
- [x] Used React for frontend development
- [x] Used node.js for backend development

## What I have done
- [x] Used async, await functions for asynchronous tasks (web scraping)
- [x] Used Google Firebase Firestore for database management

## Run locally
On the terminal
```
> cd midterm_NTUSecret/client
> yarn build
> cd ..
> yarn start
```
note: you will need a .env file in both your project root folder and client/folder
## .env Example(server)
```
PORT=8080
SKIP_PREFLIGHT_CHECK=true
SALT=your secret word
RECAPTCHA_SEC= your recaptcha server key
FACEBOOK_TOKEN= your facebook page api token
KEYWORD=["韓流","打字","有興趣了解加","兼職正妹","lineid","新平台","被動收入"]
```

## Project Development

## Frontend

I used the components library **Semantic-UI** and **React** for frontend development. Some other packages include:
1. **react-router**
2. **react-google-recaptcha** (for anti-spamming)

## Backend

- For database management, I used **firestore-admin** which is a client library for managing **Google Firstore** database
- **uuid** for generating unique code for each post
- **node-fetch** for using fetch() on server
- **shajs** for secure hash algorithm SHA512 , which adds salt and hashes uuid before storing them into server.
- **keyword-filter** for quick keyword filtering

## Frontend-Backend Interaction

The frontend uses the **fetch** method to send requests to the server (*index.js*), and the server uses **express** to handle client requests.
Also server uses node-fetch to communicate with facebook api and recaptcha api

## Wrapping it all up
Used **webpack** to bundle files and **babel** to transpile files.

## My Contributions
- Hand crafted all server-side code.
- Hand crafted all client-side code.(UI layout designed by myself)
- Facebook api requesting
- Recaptcha token verifying
- Lots of debugging.......

## About this project
這次有點太晚開始寫了.... code真的寫的頗醜，架構沒有想好，中間還砍掉重練，能夠跑起就是奇蹟了，希望未來能夠把他的穩定性與安全性再做提升之類的，這次就先交了QQ
