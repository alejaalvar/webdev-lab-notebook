const http = require("http");
const static = require("node-static");
const querystring = require("node:querystring");

const port = process.env.PORT || 5002; // default to port 5002

const file = new static.Server("./exercise");

// Server setup
const server = http.createServer((req, res) => {
  // main route
  if (req.method === "GET" && req.url === "/") {
    file.serveFile("/welcome.html", 200, {}, req, res);
  }
  // form route
  else if (req.method === "GET" && req.url === "") {
    // fill out this route
  }
  // form submission
  else if (req.method === "POST" && req.url === "") {
    let body = ""; // we need mutability since we receive data from the body

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const userdata = querystring.parse(body); // get the key-value pairs
      const { usernameInput: name, emailInput: email } = userdata; // destructure the key-value pairs

      res.writeHead(200, { "Content-Type": "text/html" });
      // Actually update the page once we're all done processing the submission
      res.write(`<p>Thank you for submitting your information: </p>`);
      res.write(`<p>Name: ${name}</p>`);
      res.write(`<p>Email: ${email}</p>`);
      res.end();
    });
  }
});

// Start up the server for listening
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
