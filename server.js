const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

let videos = [];

// Load existing videos
if (fs.existsSync('videos.json')) {
    videos = JSON.parse(fs.readFileSync('videos.json'));
}

// Serve static uploaded files
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));
app.use(express.json());

// Upload video
app.post('/upload', upload.single('video'), (req, res) => {
    const name = req.body.name;
    const file = req.file;

    if (!name || !file) {
        return res.status(400).json({ message: 'Missing name or file' });
    }

    const videoData = {
        name: name,
        filename: file.filename
    };

    videos.push(videoData);
    fs.writeFileSync('videos.json', JSON.stringify(videos, null, 2));

    res.json({ message: 'Video uploaded successfully' });
});

// Search videos
app.get('/videos', (req, res) => {
    const search = req.query.search || '';
    const filtered = videos.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));
    res.json(filtered);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
