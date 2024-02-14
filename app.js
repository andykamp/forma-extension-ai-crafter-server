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

app.use(cors(corsOptions)); // Use cors middleware with options

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/getMessage', async (req, res) => {
  const id = req.query.id;

  const procName = 'Get_Message'; 
  const params = { id: +id }; 
  try {
    const result = await execApi(procName, params);
    return res.send(result);
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    return res.status(500).send('Error message explaining the issue');
  }
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


app.get('/submitPrompt', async (req, res) => {
  const { projectId, deploymentCode, user, polygon } = req.query;

  const port = process.env.PORT || 8080

  try {

    // Construct the full URL for the /generateProjectMessage endpoint
    const generateProjectMessageUrl = `http://localhost:${port}/generateProjectMessage?projectId=${projectId}&deploymentCode=${deploymentCode}&user=${user}`;
    const projectMessageResponse = await axios.get(generateProjectMessageUrl);

    const chatPromptHistory = projectMessageResponse.data.at(0).Body
    const gptUrl = projectMessageResponse.data.at(0).Url 

    const body ={
      chatUrl: gptUrl,
      chatInput: chatPromptHistory,
    }
    const chatUrl = `http://localhost:${port}/chat`
    const chatResponse = await axios.post(chatUrl, body);
    console.log('chatResponse',chatResponse.data );

    const messageId = projectMessageResponse.data.at(0).Id
    const assistant = chatResponse.data.choices.at(0).message.content
    const {
      prompt_tokens,
      completion_tokens,
      total_tokens,
  } = chatResponse.data ;

    const upsertBody = {
      id: messageId,
      assistant,
      prompt_tokens,
      completion_tokens,
      total_tokens,
    }

    const upsertUrl = `http://localhost:${port}/upsertMessages`
    const upsertResponse = await axios.post(upsertUrl, upsertBody);

    // Combine responses or handle them as needed
    res.json({
      assistant,
      upsertResponse: upsertResponse.data.at(0)
    });
  } catch (error) {
    console.error('___Error calling internal endpoints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/chat', async (req, res) => {
  const { chatUrl, chatInput } = req.body;
  // console.log('projectId', projectId);
  // console.log('polygon', polygon);
  // const parsedBody = chatInput// JSON.parse(chatInput)
    const parsedBody = chatInput
    // const parsedBody = {
    //   "messages": chatInput.messages,
    // // [
    // //         {
    // //             "role": "system",
    // //             "content": "fsdfdsfdsf"
    // //         },
    // //         {
    // //             "role": "user",
    // //             "content": "I want 6 apartment buildings, with 4 floors"
    // //         },
    // // ],
    
    //   // "max_tokens": 800,
    //   "temperature": 0.7,
    //   "frequency_penalty": 0,
    //   "presence_penalty": 0,
    //   "top_p": 0.95,
    //   "stop": null
    // } 
  console.log('___body_____', typeof parsedBody, parsedBody);

  // const url = "https://oai-text-eastus-hackathon.openai.azure.com/openai/deployments/gpt-35-turbo-0613/chat/completions?api-version=2023-07-01-preview" 
  // const url = "https://oai-text-eastus-hackathon.openai.azure.com/openai/deployments/gpt-4-0125-Preview/chat/completions?api-version=2023-07-01-preview"
  const config = {
    headers: {
      "Content-Type": 'application/json',
       "api-key":  process.env.AICRAFTER_OPENAI_API_KEY 
    }
  }

  try {
    const response = await axios.post(
        chatUrl,
        parsedBody,
        config
    );

    res.json(response.data);
  } catch (error) {
    console.error('____API call failed:', error);
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
