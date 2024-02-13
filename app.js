var http = require('http')
var express = require('express')
var axios = require('axios')
var path = require('path')
var cors = require('cors');

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
