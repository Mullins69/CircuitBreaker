const express = require('express');
const app = express();
const fetch = require('node-fetch')
app.use(express.json());
app.set('port', process.env.port || 3000)

app.get('/', (req, res, next) => {
  res.send('<h1>ScriptBit Task<h1>');
})
//gets name
app.get('/fetchuser', async (req, res) => {
  console.log('fetch user pinged')
  const url = "https://server-2.devabdul.repl.co";
  const options = {
    "method": "GET",
  };
  const response = await fetch(url, options)
    .then(res => res.json())
    .catch(e => {
      console.log("ERROR: ");
      console.log("server 2 had a error");
    })
  if (!response) {
    const url = "https://server-3.devabdul.repl.co";
    const options = {
      "method": "GET",
    };
    const response = await fetch(url, options)
      .then(res => res.json())
      .catch(e => {
        console.log("server 3 had a error");
        console.log("BOTH SERVERS IS DOWN")
        res.json("BOTH SERVERS IS DOWN")
      })
    res.json(response)
  }
  else {
    res.json(response)
  }
})




//edits the name
app.post('/editname', async (req, res) => {
  console.log('edit name pinged')
  const test ="https://server-2.devabdul.repl.co/"
   const test2 ="https://server-3.devabdul.repl.co/"
  const url = "https://server-2.devabdul.repl.co/add";
  const url2 = "https://server-3.devabdul.repl.co/add";
  const options = {
    "method": "POST",
    "body": JSON.stringify(req.body),
    "headers": {
      "Content-Type": "application/json",
    }
  };
  const response = await fetch(test);
  const response2 = await fetch(test2)
  if(response.status === 200 || response2.status === 200){
    const response = await fetch(url, options);
  const response2 = await fetch(url2, options)
    res.json(req.body)
  }
  if (response.status === 502 || response2.status === 200)  {
        const response2 = await fetch(url2, options)
  }
  if (response.status === 200 || response2.status === 502)  {
        const response = await fetch(url, options);

  }

  else {
    console.log("Both servers offline")
  }
})



app.listen(app.get('port'), server => {
  console.info(`Server listen on port ${app.get('port')}`);
})

