// Import libraries
const latte = require("coffeelatte");
const express = require("express");
const path = require("path");

// Create application
const app = express();

// Configure coffeelatte
app.set("views", path.join(__dirname, "views"));
app.set("components", path.join(__dirname, "components"));
app.set("layout", path.join(__dirname, "demo_layout.html"));
app.set("target", "#root");

// Enable coffeelatte in the express application
latte.express(app);

// Render a view
app.get("/", (req, res) => {
    res.render("demo");
});

// Start the server
app.listen(4000, () => {
    console.log("Server listening at port 4000");
})