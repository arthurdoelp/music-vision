// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const spawn = require("child_process").spawn;
const multer = require('multer');
const fs = require('fs');

exports.spectrogramController = (req, res) => {
    console.log("Controller connected!");

    // const upload = multer({ storage: multer.memoryStorage() }).single('file')
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'python/uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })

    const upload = multer({ storage: storage }).single('file')

    upload(req, res, function (err) {

        let song = req.file
        let song_filename = song.originalname;
        for (let i = 0; i < song_filename.length; i++) {
            song_filename = song_filename.replace(" ", "_")
            song_filename = song_filename.replace("'", "")
            song_filename = song_filename.replace(",", "")
            song_filename = song_filename.replace("(", "")
            song_filename = song_filename.replace(")", "")
            song_filename = song_filename.replace("'", "")
        }
        let file_path = 'python/uploads/' + song_filename;

        // fs.writeFile(file_path, song.buffer, { encoding: 'base64' }, function (err) {
        //     console.log('File created');
        // });
        fs.rename(req.file.path, file_path, function(err) {
            console.log('File created and renamed!');
        });
        console.log("Starting Python Script");
        // // const pythonProcess = spawn('python',["path/to/script.py", arg1, arg2, ...]);
        // const pythonProcess = spawn('python', ["python/train.py", song_filename]);
        const pythonProcess = spawn('python', ["python/spectrogram.py", song_filename]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            // console.log(data);
            result += data.toString();
        });

        pythonProcess.stdout.on('end', () => {
            // console.log(result)
            console.log(JSON.parse(result));

            // fs.unlink(file_path, (err) => {
            //     if (err) {
            //         console.error(err)
            //         return
            //     }
            //     //file removed
            // })
            res.json({ data: JSON.parse(result) })
        });
    })
}

exports.predictController = (req, res) => {
    console.log("Second Controller is connected!");
    const { spectrogram_image_file_path } = req.body;
    // console.log(spectrogram_image_file_path)

    const pythonProcess = spawn('python', ["python/train.py", spectrogram_image_file_path]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        // console.log(data);
        result += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        // console.log(result)
        console.log(JSON.parse(result));

        res.status(200).json({ data: JSON.parse(result) })
    });
}