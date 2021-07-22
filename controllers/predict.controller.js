// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const spawn = require("child_process").spawn;
const multer = require('multer');
const fs = require('fs');

exports.trainController = (req, res) => {
    // console.log("Controller is connected!");
    const pythonProcess = spawn('python', ["python/train.py"]);
    pythonProcess.stdout.on('data', (data) => {
        console.log(data);
        res.json({ data: data })
    });
}

exports.predictController = (req, res) => {
    console.log("Controller connected!");

    // const upload = multer({ storage: multer.memoryStorage() }).single('file')

    // upload(req, res, function (err) {

    //     let song = req.file
    //     let song_filename = song.originalname;
    //     for (let i = 0; i < song_filename.length; i++) {
    //         song_filename = song_filename.replace(" ", "_")
    //         song_filename = song_filename.replace("'", "")
    //         song_filename = song_filename.replace(",", "")
    //         song_filename = song_filename.replace("(", "")
    //         song_filename = song_filename.replace(")", "")
    //         song_filename = song_filename.replace("'", "")
    //     }
    //     let file_path = 'python/uploads/' + song_filename;

    //     fs.writeFile(file_path, song.buffer, { encoding: 'base64' }, function (err) {
    //         console.log('File created');
    //     });
        console.log("Starting Python Script");
        // // const pythonProcess = spawn('python',["path/to/script.py", arg1, arg2, ...]);
        const pythonProcess = spawn('python', ["python/train.py", song_filename]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            // console.log(data);
            result += data.toString();
        });

        pythonProcess.stdout.on('end', () => {
            // console.log(result)
            console.log(JSON.parse(result));

            fs.unlink(file_path, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                //file removed
            })

            res.json({ data: JSON.parse(result) })
        });
    // })
}