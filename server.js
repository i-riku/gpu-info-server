const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());

app.get('/gpu-info', (req, res) => {
    exec('nvidia-smi --query-gpu=name,memory.total,memory.used --format=csv,noheader,nounits', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.sendStatus(500);
        }

        const lines = stdout.trim().split('\n');
        const data = lines.map(line => {
            const [name, memoryTotal, memoryUsed] = line.split(', ');
            return { name, memoryTotal: parseInt(memoryTotal), memoryUsed: parseInt(memoryUsed) };
        });

        res.json(data);
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
