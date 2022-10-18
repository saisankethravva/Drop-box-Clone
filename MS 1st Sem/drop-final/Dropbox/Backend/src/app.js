const express = require('express')
const app = express()
const WebServices = require('aws-sdk');
WebServices.config.update({ region: 'us-west-1' });
const dataupload = require('express-fileupload');
let cross = require('cors');
const port = 3001
const dbsystem = require('fs');
const dotenv = require('dotenv');
const config = dotenv.config();

app.use(express.json())
app.use(cross())
app.use(express.urlencoded({ extended: true }))
app.use(dataupload({
  useTempFiles: true,
  tempFileDir: 'tmp'
}));
const Storage = new WebServices.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const Database = new WebServices.DynamoDB({ apiVersion: '2012-08-10' ,
    region: "us-west-1",
    endpoint: "http://dynamodb.us-west-1.amazonaws.com",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});

function deletefiles(file_path) {
  try {
    dbsystem.unlinkSync(file_path)
    //removing file
  } catch (err) {
    console.error("Unable to delete the file from database" + err);
  }
}
app.post('/upload_file', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('files not found.');
  }
  const fileData = dbsystem.createReadStream(req.files.inputFile.tempFilePath);

  const storage_params = {
    Bucket: "sanketh-dropbox",
    Key: req.files.inputFile.name,
    ContentType: req.files.inputFile.mimetype,
    Body: fileData
  };

  // Uploading files to the bucket
  Storage.upload(storage_params, function (err, data) {
    if (err) {
      console.log("Cannot upload the data file", err);
      return res.status(500).send(`Cannot insert the file. ${err}`)
      // Send 500 Response 
    } else {
      deletefiles(req.files.inputFile.tempFilePath);
      updateDataBase();
      console.log(`File uploaded successfully. ${data.Location}`);
      return res.status(200).send(`File uploaded successfully. ${data.Location}`)
    }
  });

  function updateDataBase() {
    console.log(`userName: ${req.body.userName}`)//.body.userName
    console.log(`FileName: ${req.files.inputFile.name}`)
    var Timenow = new Date().toString();
    console.log(`currentTime: ${Timenow}`)
    //var epoch = Math.floor(currentTime/1000)
    //var time = new Date();
    var uName = req.body.userName
    var desc = req.body.description
    var fname = req.files.inputFile.name;
    var uId = uName.concat("_", fname)
    console.log(`userId: ${uId}`)
    console.log(`description: ${desc}`)

    Database.scan({
      TableName: 'dropbox-files-table',
    }, function (err, data) {
      if (err) {
        console.log("Error", err);

      } else {
        console.log("Success", data.Items);
        const foundItems = data.Items.filter(item => item.userId.S === uId);
        if (foundItems.length > 0) {
          console.log("File is already exists, so updating it", foundItems);
          const foundItem = foundItems[0];
          console.log("Updating FIle item ", foundItem);
          putItem(uId, uName, fname, desc, foundItem.fileCreatedTime.S);
        } else {
          console.log("It is new file, so creating new record ", uId);
          putItem(uId, uName, fname, desc, Timenow);
        }

      }
    });

  }

});

function putItem(userId, userName, fileName, description, fileCreationTime) {
  const ddbparams = {
    TableName: 'dropbox-files-table',
    Item: {
      'userId': { S: userId },
      'userName': { S: userName },
      'fileName': { S: fileName },
      'description': { S: description },
      'fileCreatedTime': { S: fileCreationTime },
      'fileUpdatedTime': { S: new Date().toString() }
    }
  };

  // Call DynamoDB to add the item to the table
  Database.putItem(ddbparams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}

app.delete('/delete_file', function (req, res) {
  console.log("REQUEST param ", req.body);
  if (!req.body || !req.body.hasOwnProperty('deleteFile')) {
    return res.status(400).send('deleteFile missing in body');
  }

  const fileDeletePath = req.body.deleteFile
  const userId = req.body.userId
  // Setting up S3 delete parameters
  const params = {
    Bucket: "sanketh-dropbox",
    Key: fileDeletePath
    /*  Delete: { 
         Objects: [ 
           {
             Key: fileDeletePath 
           }
         ],
       }, This method is useful when you want to delete multiple files */
  };
  // Deleting files to the bucket
  Storage.deleteObject(params, function (err, data) {
    if (err) {
      console.log("Error in deleting file", err);
      return res.status(500).send(`Can not delete the file. ${err}`)
    } else {
      deleteDatabaseEntry();
      console.log(`File deleted successfully.`);
      return res.status(200).send(`File deleted successfully.`);
    }

  });

  function deleteDatabaseEntry() {
    const ddbparams = {
      TableName: 'dropbox-files-table',
      Key: {
        "userId": { "S": userId }

      }
    };

    // Call DynamoDB to delete the item from the table
    Database.deleteItem(ddbparams, function (err, data) {
      console.log
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  }
});

app.get('/getUserData/:userName', function (req, res) {
  WebServices.config.update({
    region: "us-west-1",
    endpoint: "http://dynamodb.us-west-1.amazonaws.com",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  
  var docClient = new WebServices.DynamoDB.DocumentClient();
  
  var table = "dropbox-files-table";
  const userName = req.params.userName
  console.log("userName:"+userName)
  var params = {
      TableName: table,
      FilterExpression: '#userName = :userName',
      ExpressionAttributeNames: {
        '#userName' : 'userName'
      },
      ExpressionAttributeValues: {
        ':userName' : userName
      }

  };
  
  docClient.scan(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          return res.status(500).send(`Can not get the data. ${err}`)
      } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
          return res.status(200).json(data.Items);
      }
  });
  
});

app.get('/getAdminData', function (req, res) {
  WebServices.config.update({
    region: "us-west-1",
    endpoint: "http://dynamodb.us-west-1.amazonaws.com",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  
  var docClient = new WebServices.DynamoDB.DocumentClient();
  var params = {
    TableName: 'dropbox-files-table',
    /*  Key: {
       'userId': {N: '001'}
     },
     ProjectionExpression: 'ATTRIBUTE_NAME' */
  };

  // Call DynamoDB to read the item from the table
  docClient.scan(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      return res.status(500).send(`Can not get the data. ${err}`)
    } else {
      console.log("Success", data.Items);
      return res.status(200).json(data.Items);
      //return res.status(200).json(data);
    }
  });
});


app.listen(port, () => console.log(`cloud project app listening on port ${port}!`))