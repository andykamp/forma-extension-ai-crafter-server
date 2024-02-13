const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.AICRAFTER_DB_USER,
  password: process.env.AICRAFTER_DB_PASSWORD, 
  server: process.env.AICRAFTER_DB_SERVER, 
  database: 'AiCrafter',
  options: {
    encrypt: true, 
    trustServerCertificate: false,
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server successfully!');
    return pool;
  })
  .catch(err => console.error('Database Connection Failed! Bad Config: ', err));

// Function to execute a stored procedure with parameters
function execApi(procName, params) {
  return new Promise(async (resolve, reject) => {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Assuming params is an object where keys are parameter names and values are parameter values
      Object.keys(params).forEach(paramName => {
        request.input(paramName, params[paramName]);
      });

      // Execute the stored procedure
      const results = await request.execute(procName);
      resolve(results.recordset); // Assuming you want to return the recordset
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  sql, poolPromise, execApi
};

