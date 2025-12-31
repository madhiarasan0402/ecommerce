const http = require('http');

http.get('http://localhost:5000/api/products', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received.
    resp.on('end', () => {
        console.log("Status Code:", resp.statusCode);
        try {
            const json = JSON.parse(data);
            console.log("Product Count:", json.length);
            console.log("Sample:", json[0]);
        } catch (e) {
            console.log("Response not JSON:", data.substring(0, 100));
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
