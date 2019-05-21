const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const fetch = require('node-fetch');
const admin = require('firebase-admin');
const env = require('dotenv/config');
const keywordfilter = require('keyword-filter');
const filter = new keywordfilter()
filter.init(JSON.parse(process.env.KEYWORD));
//the file has to be deleted later
var serviceAccount = require('/your/path/to/serviceAccout.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();
  

const shajs = require('sha.js');

const app = express();

// Serve the static files from the React app
app.use(express.static('client/build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





const salt = process.env.SALT;
const recaptchasec = process.env.RECAPTCHA_SEC
const facebooktoken = process.env.FACEBOOK_TOKEN

let Authtoks = {}
//input message output a promise resolves message messageid
const newpost_facebookapi = async (message) => {
    filter.replaceKeywords(message,'(っ・Д・)っ');
    let res = await fetch('https://graph.facebook.com/v3.3/358964794749086/feed?access_token=' + facebooktoken + '&message=' + message ,{method: 'POST'})
    res = await res.json();
    return {cont: message, id : res.id}
    
};

const delete_facebookapi = async (id) =>{
    let res = await fetch( 'https://graph.facebook.com/v3.3/' + id +'?access_token=' + facebooktoken, {method: 'DELETE'});
    res = await res.json();
    return res.success;
}
const edit_facebookapi  = async (id,message) =>{
    filter.replaceKeywords(message,'(っ・Д・)っ')
    let res = await fetch('https://graph.facebook.com/v3.3/' + id +'?access_token=' + facebooktoken + '&message='+ encodeURI(message),{method: 'POST'})
    res = await res.json();
    return res.success;
}
const postRef = db.collection('posts');
const add_data_to_firestore = async(hashed,post) =>{
    return postRef.doc(hashed).set(post);
}
const get_data_from_firestore = async(hashed,res) =>{
    let gdata = await postRef.doc(hashed).get();
    if(!gdata.exists){
        return res.sed({message:'uuid not found'})
    }
    else{
        let data = await gdata.data();
        return res.send(data);
    }
}
const check_data_existence_in_firestore = async(hashed,res) =>{
    let gdata = await postRef.doc(hashed).get();
    if(gdata.exists){
        res.send({});
    }
    else{
        return res.status(400).send({
            message: 'uuid not found'
        })
    }
}
const update_data_in_firestore = async(hashed,message) =>{
    return postRef.doc(hashed).update({message: message});
}
const delete_data_of_firestore = async(hashed) =>{
    return postRef.doc(hashed).delete();
}
/*
input message and verify token
store them into database
*/
app.post('/api/posts', (req, res) => {
    const id = uuidv4();
    const verifytok = req.body.verifytoken;
    fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'secret=' + recaptchasec + '&response=' + verifytok
    })
        .then(res => res.json())
        .then(gres => {
            let success = gres.success
            //if google verification failed
            
            if (!success) {
                return res.status(400).send({
                    message: 'verification failed'
                });
            }
            newpost_facebookapi(req.body.message).then(
                (obj) => {
                    let hashed = new shajs.sha512().update(id + salt).digest('hex');
                    //posts[hashed] = { message: obj.cont, facebookid: obj.id }
                    add_data_to_firestore(hashed, { message: obj.cont, facebookid: obj.id })
                    //console.log(posts);
                    return res.send({ uuid: id });
                });

        });

});
//check is tok valid
//check if uuid exist
//retreive if both valid
app.get('/api/posts/:uuid/:authtok/message', (req, res) => {
    const uuid = req.params.uuid;
    const hashed = new shajs.sha512().update(uuid + salt).digest('hex');
    const verifytok = req.params.authtok;
    if (!Authtoks[verifytok]) {
        return res.status(400).send({ message: 'invalid or expired token' });
    }
    if (Authtoks[verifytok].hashed != hashed) {
        return res.status(400).send({ message: 'uuid does not exist' })
    }
    get_data_from_firestore(hashed,res);
})
//input uuid
//check post from database
//store token in server
app.get('/api/posts/:uuid/:authtok', (req, res) => {
    const uuid = req.params.uuid;
    const hashed = new shajs.sha512().update(uuid + salt).digest('hex');
    const verifytok = req.params.authtok;
    fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'secret=' + recaptchasec + '&response=' + verifytok
    })
        .then(res => res.json())
        .then(gres => {
            let success = gres.success
            if (!success) {
                return res.status(400).send({
                    message: 'verification failed'
                });
            }
            //store them and settimeout
            Authtoks[verifytok] = { hashed: hashed, timeoutid: setTimeout(() => { delete Authtoks[verifytok] }, 1000 * 60 * 60 * 2) } // expires after two hours
            //TODO should lookup database
            /*
            if (posts[hashed]) {
                return res.send({});
            }
            else {
                return res.status(400).send({
                    message: 'uuid not found'
                })
            }
            */
           check_data_existence_in_firestore(hashed,res);
        })

})
//check if token and uuid valid
//edit specific post
//delete valid tok
app.put('/api/posts/:uuid/:authtok/:newmessage', (req, res) => {
    const uuid = req.params.uuid;
    const hashed = new shajs.sha512().update(uuid + salt).digest('hex');
    const newmsg = req.params.newmessage;
    const verifytok = req.params.authtok;
    //console.log(Authtoks[verifytok]);
    if (!Authtoks[verifytok]) {
        return res.status(400).send({ message: 'invalid or expired token' });
    }
    if (Authtoks[verifytok].hashed != hashed) {
        return res.status(400).send({ message: 'uuid does not exist' })
    }
    //TODO need to modify database
    postRef.doc(hashed).get().then(
        data => data.data()
    ).then(
        data => edit_facebookapi(data.facebookid,newmsg).then(
            (result) => res.send({ message: (result.success) ? 'success' : 'failed' })
        )
    )
    update_data_in_firestore(hashed,newmsg);
    //posts[hashed].message = newmsg;
    clearTimeout(Authtoks[verifytok].timeout);
    delete Authtoks[verifytok];
    //console.log(posts);
})
//check if token and uuid valid
//delete specific post
//delete valid tok
app.delete('/api/posts/:uuid/:authtok', (req, res) => {
    const uuid = req.params.uuid;
    const hashed = new shajs.sha512().update(uuid + salt).digest('hex');
    const verifytok = req.params.authtok;
    //console.log(Authtoks[verifytok]);
    if (!Authtoks[verifytok]) {
        return res.status(400).send({ message: 'invalid or expired token' });
    }
    if (Authtoks[verifytok].hashed != hashed) {
        return res.status(400).send({ message: 'uuid does not exist' })
    }
    //TODO need to modify database
    postRef.doc(hashed).get().then(
        data => data.data()
    ).then(
        data => delete_facebookapi(data.facebookid).then(
            (result) => res.send({ message: (result.success) ? 'success' : 'failed' })
        )
    )
    //delete posts[hashed];
    delete_data_of_firestore(hashed);
    clearTimeout(Authtoks[verifytok].timeout);
    delete Authtoks[verifytok];
    //console.log(posts);
})


// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log('App is listening on port ' + port);

//TODO lots of error handling