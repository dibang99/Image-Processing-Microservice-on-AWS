import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  app.get( "/filteredimage", async (req, res) => {

    try { 
  //    1. validate the image_url query
      const { image_url } = req.query;

      if (!image_url) {
        res.status(400).send(`The param "image_url" is missing.`);
        return;
      }
      //    2. call filterImageFromURL(image_url) to filter the image
      try {
        const filteredImagePath = await filterImageFromURL(image_url)
        //    3. send the resulting file in the response
        res.sendFile(filteredImagePath);
        //    4. deletes any files on the server on finish of the response
        res.on('finish', function () {
          // clear local files on finish
          deleteLocalFiles([filteredImagePath]);
        });

      } catch (errorFilter) {
        // func filterImageFromURL throws an error
        res.status(400).send(`Cannot filter the image from url. Please check it.\n` + errorFilter);
        return;
      }

    } catch (errorExternal) {
      // func filterImageFromURL throws an error
      res.status(500).send(`Error:\n` + error);
    }
  });

  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
