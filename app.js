var http = require('http')
var express = require('express')
var axios = require('axios')
var path = require('path')
var cors = require('cors');
// const sql = require('mssql');
const { poolPromise, sql, execApi } = require('./database'); // Adjust the path to where your database.js file is located



require('dotenv').config();

var bodyParser = require('body-parser')
var errorHandler = require('errorhandler')

var app = express()

// all environments
app.set('port', process.env.PORT || 8080)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration for specific origin
var corsOptions = {
  origin: 'http://localhost:8081' // Adjust if your React app's origin is different
};

//---------------------------------
// SQL Server connection
//---------------------------------

// const config = {
//   user: process.env.AICRAFTER_DB_USER,
//   password:  process.env.AICRAFTER_DB_PASSWORD, 
//   server: process.env.AICRAFTER_DB_SERVER, 
//   database: 'AiCrafter',
//   options: {
//     encrypt: true, 
//     trustServerCertificate: false, 
//   }
// };
// sql.connect(config).then(pool => {
//   // You can execute SQL queries here
//   console.log('Connected to SQL Server successfully!');
// }).catch(error => {
//   console.error('Error connecting to SQL Server:', error);
// });

// Function to execute a stored procedure with parameters
// function execApi(procName, params) {
//   return new Promise((resolve, reject) => {
//     connection.query(`CALL ${procName}(?)`, [params], (error, results, fields) => {
//       if (error) {
//         reject(error);
//       }
//       resolve(results);
//     });
//   });
// }

//---------------------------------
//---------------------------------

app.use(cors(corsOptions)); // Use cors middleware with options


app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/getMessagesByProjectId', async (req, res) => {
  const projectId = req.query.projectId;

  const procName = 'Get_MessagesByProjectId'; 
  const params = { projectId: projectId }; 
  try {
    const result = await execApi(procName, params);
    return res.send(result);
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    return res.status(500).send('Error message explaining the issue');
  }
});

app.get('/generateProjectMessage', async (req, res) => {
  const { projectId, deploymentCode, user } = req.query;
  const procName = 'GenerateProjectMessage'; 
  const params = { 
    projectId: projectId,
    deploymentCode: deploymentCode,
    user: user
  }; 
  try {
    const result = await execApi(procName, params);
    return  res.send(result);
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    return res.status(500).send('Error message explaining the issue');
  }
});

app.post('/upsertMessages', async  (req, res) => {
  const {
    id,
    prompt_tokens,
    completion_tokens,
    total_tokens,
    assistant
  } = req.body;

  console.log(   
    id,
    prompt_tokens,
    completion_tokens,
    total_tokens,
    assistant
 );

  const procName = 'Upsert_Messages'; 
  const params = { 
     id,
     prompt_tokens, 
     completion_tokens, 
     total_tokens, 
     assistant
  }; 
  try {
    const result = await execApi(procName, params);
    return res.send(result);
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    return res.status(500).send('Error message explaining the issue');
  }
});

app.get('/Get_Gpt_Deployments', async  (req, res) => {
  const procName = 'Get_Gpt_Deployments'; 
  const params = {}; 
  try {
    const result = await execApi(procName, params);
    return res.send(result);
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    return res.status(500).send('Error message explaining the issue');
  }
});



app.post('/chat', async (req, res) => {
  const { projectId, polygon, promptHistory } = req.body;
  console.log('projectId', projectId);
  console.log('polygon', polygon);
  console.log('promptHistory', promptHistory);

    // Validate inputs here as needed

  const url = "https://oai-text-eastus-hackathon.openai.azure.com/openai/deployments/gpt-35-turbo-0613/chat/completions?api-version=2023-07-01-preview" 

  const body = {
      "messages": promptHistory,
      "max_tokens": 800,
      "temperature": 0.7,
      "frequency_penalty": 0,
      "presence_penalty": 0,
      "top_p": 0.95,
      "stop": null
    } 

    const config = {
      headers: {
        "Content-Type": 'application/json',
         "api-key":  process.env.AICRAFTER_OPENAI_API_KEY 
      }
    }

    try {
      const response = await axios.post(
          url,
          body,
          config
      );

      res.json(response.data);
    } catch (error) {
      console.error('API call failed:', error);
      res.status(500).send('Internal Server Error');
    }
});

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
  app.use(errorHandler())
}

var server = http.createServer(app)
server.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})
