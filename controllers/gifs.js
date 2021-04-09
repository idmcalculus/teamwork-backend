const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
const generateId = require('../models/database/identity');
require('../models/database/gifs')();
const db = require('../models/database/index');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

class GifsController {
    static async postGifs(req, res) {
      try {
        const file = req.files.image;
        if (!file) {
			return res.status(404).json({ 
				message: 'Image is required' 
			});
		}
    
        const { title } = req.body;
        if (!title) {
			return res.status(400).json({ 
				message: 'title is required' 
			});
		}
    
        const gifsCloud = await cloudinary.v2.uploader.upload(file.tempFilePath);
        const { secure_url: secureUrl, created_at: createdOn, public_id: publicId } = gifsCloud;
    
        const identity = generateId(100000);
    
        const createdBy = req.body.email;
    
        await db.query(
          `INSERT INTO gifs (gifId, title, imageUrl, createdOn, publicId, createdBy) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
          [identity, title, secureUrl, createdOn, publicId, createdBy],
        );
        return res.status(201).json({
          status: 'success',
          data: {
            gifId: identity,
            message: 'gif image successfully posted.',
            createdOn,
            title,
            imageUrl: secureUrl,
            createdBy,
          },
        });
      } catch (err) {
        res.status(400).json({
			status: 'error',
			data: err
		});
      }
    }
    
    static async getAllGifs(req, res) {
      try {
        const gifs = await db.query('SELECT * FROM gifs ORDER BY createdOn DESC');
        res.status(200).json({
          status: 'Success',
          data: gifs.rows,
        });
      } catch (err) {
        res.status(400).json({
			status: 'error',
			data: err
		});
      }
    }

    static async getSingleGif(req, res) {
      try {
        const { gifId } = req.params;
        const gif = await db.query(`SELECT * FROM gifs WHERE gifId = ${gifId}`);
        if (gif.rows.length === 0) {
          return res.status(404).json({
            status: 'error',
            error: 'gif with the specified ID not found',
          });
        }
        return res.status(200).json({
          status: 'success',
          data: gif.rows[0],
        });
      } catch (err) {
        res.status(400).json({
			status: 'error',
			data: err
		});
      }
    }

    static async deleteGif(req, res) {
        try {
          const { gifId } = req.params;
    
          const gif = await db.query(`SELECT * FROM gifs WHERE gifId = ${gifId}`);
          
          if (gif.rows.length === 0) {
            return res.status(404).json({
              status: 'error',
              error: 'gif with the specified ID not found',
            });
          }
      
          if (gif.rows[0].createdby !== req.user.email) {
            return res.status(403).json({
              status: 'error',
              message: 'You cannot delete this gif',
            });
          }
      
          await cloudinary.v2.uploader.destroy(gif.rows[0].publicid);
      
      
          await db.query(`DELETE FROM gifs WHERE gifId = ${gifId}`);
          
          if (gif.rowCount === 0) {
            return res.status(404).json({ message: 'gif Not Found' });
          }
          
          return res.status(202).json({
            status: 'success',
            data: {
              message: 'gif deleted successfully',
            },
          });
        } catch (err) {
			res.status(400).json({
				status: 'error',
				data: err
			});
        }
    }
}

module.exports = GifsController;