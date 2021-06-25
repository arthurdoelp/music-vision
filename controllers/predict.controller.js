// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const spawn = require("child_process").spawn;
// const multer = require('multer');
// const fs = require('fs');

exports.trainController = (req, res) => {
    console.log("Controller is connected!");
    // const upload = multer({ storage: multer.memoryStorage() }).single('file')

    // upload(req, res, function (err) {

    //     let image = req.body.file
    //     let new_image = image.slice(22);
    //     let file_path = 'predictions/image-' + Date.now() + '.png';

    //     fs.writeFile(file_path, new_image, {encoding: 'base64'}, function(err) {
    //         console.log('File created');
    //     });
    //     // const pythonProcess = spawn('python',["path/to/script.py", arg1, arg2, ...]);
    //     const pythonProcess = spawn('python', ["python/predict_image.py", file_path]);

    //     pythonProcess.stdout.on('data', (data) => {
    //         // console.log(data);
    //         // Do something with the data returned from python script
    //         let cleaned_data = data.toString().replace(/(\r\n|\n|\r)/gm,"").slice(1,-1);
    //         console.log(cleaned_data);

    //         fs.unlink(file_path, (err) => {
    //             if (err) {
    //                 console.error(err)
    //                 return
    //             }
    //             //file removed
    //         })

    //         res.json({ data: cleaned_data })
    //     });
    // })
}