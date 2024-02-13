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

app.get('/getMessagesByProjectId', (req, res) => {
  const projectId = req.query.projectId;
  const f = [
    {
        "Id": 3,
        "DeploymentCode": 1,
        "ProjectId": "ProjectId-123456789",
        "User": "Create a round blue building",
        "Assistant": "<script>\r\nconst scene = new THREE.Scene();\r\nconst camera = new THREE.PerspectiveCamera(75, window.innerWidth \/ window.innerHeight, 0.1, 1000);\r\nconst renderer = new THREE.WebGLRenderer();\r\nrenderer.setSize(window.innerWidth, window.innerHeight);\r\ndocument.body.appendChild(renderer.domElement);\r\n\r\nfunction createFloor(x, y, z, color) {\r\n    const geometry = new THREE.BoxGeometry(10, 3, 10);\r\n    const material = new THREE.MeshBasicMaterial({ color: color });\r\n    const floor = new THREE.Mesh(geometry, material);\r\n    floor.position.set(x, y, z);\r\n    scene.add(floor);\r\n\r\n    const edges = new THREE.EdgesGeometry(geometry);\r\n    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));\r\n    line.position.set(x, y, z);\r\n    scene.add(line);\r\n}\r\n\r\nfunction createApartment(x, z, floors) {\r\n    const floorHeight = 3;\r\n    const colors = [0xFEEAA5, 0xD8DCFF];\r\n\r\n    for (let i = 0; i < floors; i++) {\r\n        const y = (i * floorHeight) + (floorHeight \/ 2) - 0.5;\r\n        const color = colors[i % colors.length];\r\n        createFloor(x, y, z, color);\r\n    }\r\n}\r\n\r\nfunction createApartments() {\r\n    for (let i = 0; i < 50; i++) {\r\n        const x = Math.random() * 800 - 400;\r\n        const z = Math.random() * 800 - 400;\r\n        const floors = Math.floor(Math.random() * 8) + 3; \/\/ 3 to 10 floors\r\n        createApartment(x, z, floors);\r\n    }\r\n}\r\n\r\nfunction createShoppingMall() {\r\n    const geometry = new THREE.BoxGeometry(100, 30, 100);\r\n    const material = new THREE.MeshBasicMaterial({ color: 0x8A2BE2 });\r\n    const mall = new THREE.Mesh(geometry, material);\r\n    mall.position.set(0, 15, 0);\r\n    scene.add(mall);\r\n\r\n    const edges = new THREE.EdgesGeometry(geometry);\r\n    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));\r\n    line.position.set(0, 15, 0);\r\n    scene.add(line);\r\n}\r\n\r\ncreateApartments();\r\ncreateShoppingMall();\r\n\r\ncamera.position.set(200, 100, 400);\r\ncamera.lookAt(scene.position);\r\n\r\nlet angle = 0;\r\nconst radius = 800;\r\n\r\nfunction animate() {\r\n    requestAnimationFrame(animate);\r\n\r\n    angle += 0.001;\r\n\r\n    camera.position.x = radius * Math.sin(angle);\r\n    camera.position.z = radius * Math.cos(angle);\r\n    camera.lookAt(new THREE.Vector3(0, 50, 0));\r\n\r\n    renderer.render(scene, camera);\r\n}\r\n\r\nanimate();\r\n\r\n<\/script>",
        "Prompt_tokens": 567,
        "Completion_tokens": 607,
        "Total_tokens": 1174,
        "CreatedAt": "2024-02-13T15:17:39.0025394",
        "UpdatedAt": "2024-02-13T15:22:50.5518346",
        "IsDeleted": false
    },
    {
        "Id": 4,
        "DeploymentCode": 1,
        "ProjectId": "ProjectId-123456789",
        "User": "Add a TV-tower in the center of the building. ",
        "Assistant": "<script>  \r\n    \/\/ Set up the scene, camera, and renderer  \r\n    const scene = new THREE.Scene();  \r\n    const camera = new THREE.PerspectiveCamera(75, window.innerWidth \/ window.innerHeight, 0.1, 1000);  \r\n    const renderer = new THREE.WebGLRenderer();  \r\n    renderer.setSize(window.innerWidth, window.innerHeight);  \r\n    document.body.appendChild(renderer.domElement);  \r\n  \r\n    \/\/ Add a basic ambient light and a directional light for better visibility  \r\n    const ambientLight = new THREE.AmbientLight(0x404040); \/\/ Soft white light  \r\n    scene.add(ambientLight);  \r\n    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); \/\/ White directional light  \r\n    scene.add(directionalLight);  \r\n  \r\n    \/\/ Create a round blue building  \r\n    const buildingGeometry = new THREE.CylinderGeometry(5, 5, 20, 32); \/\/ Parameters: top radius, bottom radius, height, radial segments  \r\n    const buildingMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff}); \/\/ Blue color  \r\n    const buildingCylinder = new THREE.Mesh(buildingGeometry, buildingMaterial);  \r\n      \r\n    scene.add(buildingCylinder);  \r\n  \r\n    \/\/ Add a TV-tower on top of the building  \r\n    const towerBaseGeometry = new THREE.CylinderGeometry(2, 2.5, 4, 16); \/\/ Smaller base for the tower  \r\n    const towerBaseMaterial = new THREE.MeshPhongMaterial({color: 0x888888}); \/\/ Grey color for the base  \r\n    const towerBaseMesh = new THREE.Mesh(towerBaseGeometry, towerBaseMaterial);  \r\n      \r\n    towerBaseMesh.position.y = 12; \/\/ Position the base on top of the building  \r\n  \r\n    scene.add(towerBaseMesh);  \r\n  \r\n    const towerAntennaGeometry = new THREE.CylinderGeometry(0.5, 1.5, 10, 16); \/\/ Antenna part of the tower  \r\n    const towerAntennaMaterial = new THREE.MeshPhongMaterial({color: 0xaaaaaa}); \/\/ Lighter grey for the antenna  \r\n    const towerAntennaMesh = new THREE.Mesh(towerAntennaGeometry, towerAntennaMaterial);  \r\n      \r\n    towerAntennaMesh.position.y = 17; \/\/ Position the antenna on top of the base  \r\n  \r\n    scene.add(towerAntennaMesh);  \r\n  \r\ncamera.position.z=50;  \r\n  \r\nfunction animate() {  \r\nrequestAnimationFrame(animate);  \r\nrenderer.render(scene,camera);  \r\n}  \r\n  \r\nanimate();  \r\n<\/script>",
        "Prompt_tokens": 567,
        "Completion_tokens": 607,
        "Total_tokens": 1174,
        "CreatedAt": "2024-02-13T15:35:49.0330200",
        "UpdatedAt": "2024-02-13T17:16:42.1486515",
        "IsDeleted": false
    },
    {
        "Id": 6,
        "DeploymentCode": 1,
        "ProjectId": "ProjectId-123456789",
        "User": "Set up a school beside the current building",
        "Assistant": "<script>  \r\n    \/\/ Set up the scene, camera, and renderer  \r\n    const scene = new THREE.Scene();  \r\n    const camera = new THREE.PerspectiveCamera(75, window.innerWidth \/ window.innerHeight, 0.1, 1000);  \r\n    const renderer = new THREE.WebGLRenderer();  \r\n    renderer.setSize(window.innerWidth, window.innerHeight);  \r\n    document.body.appendChild(renderer.domElement);  \r\n  \r\n    \/\/ Add a basic ambient light and a directional light for better visibility  \r\n    const ambientLight = new THREE.AmbientLight(0x404040); \/\/ Soft white light  \r\n    scene.add(ambientLight);  \r\n    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); \/\/ White directional light  \r\n    scene.add(directionalLight);  \r\n  \r\n    \/\/ Create a round blue building (the original building)  \r\n    const buildingGeometry = new THREE.CylinderGeometry(5, 5, 20, 32); \/\/ Parameters: top radius, bottom radius, height, radial segments  \r\n    const buildingMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff}); \/\/ Blue color  \r\n    const buildingCylinder = new THREE.Mesh(buildingGeometry, buildingMaterial);  \r\n      \r\n    scene.add(buildingCylinder);  \r\n  \r\n    \/\/ Add a TV-tower on top of the building  \r\n    const towerBaseGeometry = new THREE.CylinderGeometry(2, 2.5, 4, 16); \/\/ Smaller base for the tower  \r\n    const towerBaseMaterial = new THREE.MeshPhongMaterial({color: 0x888888}); \/\/ Grey color for the base  \r\n    const towerBaseMesh = new THREE.Mesh(towerBaseGeometry, towerBaseMaterial);  \r\n      \r\n    towerBaseMesh.position.y = 12; \/\/ Position the base on top of the building  \r\n  \r\n    scene.add(towerBaseMesh);  \r\n  \r\n    const towerAntennaGeometry = new THREE.CylinderGeometry(0.5, 1.5, 10, 16); \/\/ Antenna part of the tower  \r\n    const towerAntennaMaterial = new THREE.MeshPhongMaterial({color: 0xaaaaaa}); \/\/ Lighter grey for the antenna  \r\n    const towerAntennaMesh = new THREE.Mesh(towerAntennaGeometry, towerAntennaMaterial);  \r\n      \r\n    towerAntennaMesh.position.y = 17; \/\/ Position the antenna on top of the base  \r\n  \r\n    scene.add(towerAntennaMesh);  \r\n    \r\n\t\/\/ Set up a school beside the current building  \r\n  \r\n\tconst schoolWidth=10;  \r\n\tconst schoolHeight=6;  \r\n\tconst schoolDepth=8;  \r\n  \r\n\tconst schoolGeometry=new THREE.BoxGeometry(schoolWidth,schoolHeight,schoolDepth);  \r\n\tconst schoolMaterial=new THREE.MeshPhongMaterial({color:0xffd700}); \/\/ Gold color for school  \r\n  \r\n\tconst school=new THREE.Mesh(schoolGeometry,schoolMaterial);  \r\n  \r\n\tschool.position.set(-15,-7,-10); \/\/ Positioning the school beside the current building  \r\n  \r\n\tscene.add(school);  \r\n  \r\n  \r\n\tcamera.position.z=50;  \r\n  \r\n\tfunction animate() {  \r\n\trequestAnimationFrame(animate);  \r\n\trenderer.render(scene,camera);  \r\n}  \r\n  \r\nanimate();  \r\n<\/script> ",
        "Prompt_tokens": 3123,
        "Completion_tokens": 321,
        "Total_tokens": 3213,
        "CreatedAt": "2024-02-13T17:12:59.6773922",
        "UpdatedAt": "2024-02-13T17:15:03.3979051",
        "IsDeleted": false
    }
]
    res.send(f);
});

app.get('/generateProjectMessage', (req, res) => {
  const { projectId, deploymentCode, user } = req.query;

    res.send('generateProjectMessage');
});

app.post('/upsertMessages', (req, res) => {
    res.send('upsertMessages');
});

app.post('/Get_Gpt_Deployments', (req, res) => {
    res.send('Get_Gpt_Deployments');
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
