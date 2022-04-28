const express = require('express');
const app = express();
const fetch = require('node-fetch')
const Database = require("@replit/database")
const os = require('os-utils');


app.use(express.json());

app.set('port', process.env.port || 3000)
const db = new Database()

let CpuUsage = 0;
function intervalFunc() {
    os.cpuUsage(function(v){
    console.log( 'CPU Usage (%): ' + v * 100 + '%' );
    CpuUsage = v * 100
});
     }
    setInterval(intervalFunc,5000);
app.get('/', async (req, res, next) => {
  if(CpuUsage >= 99.1){
      console.log("server 3 overload, attempting to use 2")
    let name = await fetch('https://server-2.devabdul.repl.co/')
    let options = {
      "method": "GET",
    };
    if(name.status === 502){
       db.get("fullname").then(value => {
    res.json(value)
  });
    }
    if(name.status === 200){
      const response = await fetch('https://server-3.devabdul.repl.co/', options).then(res => res.json())
      res.json(response)
    }
  }
  else{
      db.get("fullname").then(value => {
    res.json(value)
  });
  }
});
app.post('/recc', (req, res) => {
    let body = JSON.stringify(req.body)

  db.set("fullname", JSON.parse(body)).then((resp) => {
    res.json(resp)
  });
});
app.post('/add', async (req, res) => {
  let body = JSON.stringify(req.body)
  const url = "https://server-2.devabdul.repl.co/recc"
  const options = {
    "method": "POST",
    "body": body,
    "headers": {
      "Content-Type": "application/json",
    }
  };
  db.set("fullname", JSON.parse(body)).then((resp) => {
    res.json(resp)
  });
   try {
    let response = await fetch(url, options)
    if (response.status === 200) {
      console.log("saved on server 2")
    }
    console.log(response)
    if (response.status === 502) {
      while (response.status === 502) {
        let response = await fetch(url, options);
        if (response.status === 200) {
          console.log("SYNCED")
          console.log("-----------------")
          console.log("SAVED ON SERVER 2 SUCCESSFULLY")
          break;
        }
      }
    }

  }

  catch (error) {
    console.log(error)
  }
})

app.listen(app.get('port'), server => {
  console.info(`Server listen on port ${app.get('port')}`);
})
