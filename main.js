var mqtt = require('mqtt');
var nodemailer = require('nodemailer');

// MQTT broker connection options
var mqttOptions = {
    host: 'first-7bq3gk.a02.usw2.aws.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'udSewwandi',
    password: 'SLT567intern'
};

// Initialize MQTT client
var client = mqtt.connect(mqttOptions);

// Nodemailer configuration (replace with your SMTP server details)
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sewwandidarshani95@gmail.com',
        pass: 'nxkh uins swso fxqu'
    }
});

// Email notification function
function sendEmailNotification(temperature) {
    var mailOptions = {
        from: 'sewwandidarshani95@gmail.com',
        to: 'rathnappayasee@gmail.com', // Replace with the subscriber's email
        subject: 'High Greenhouse Temperature Alert',
        text: `The greenhouse temperature is high (${temperature}°C). Please ventilation system may be activated to cool the greenhouse.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// MQTT event handlers
client.on('connect', function () {
    console.log('Connected to MQTT broker');
    // Subscribe to the temperature topic
    client.subscribe('agriculture/greenhouse/temperature');
});

client.on('error', function (error) {
    console.error('MQTT error:', error);
});

client.on('message', function (topic, message) {
    // Called each time a message is received
    console.log('Received message:', topic, message.toString());

    // Parse the temperature value from the message
    var temperature = parseFloat(message.toString());

    // Check if the temperature exceeds 27 degrees Celsius
    if (!isNaN(temperature) && temperature > 27) {
        sendEmailNotification(temperature);
    }
});

// Publish a sample temperature message every 30 seconds (for testing)
setInterval(function () {
    var randomTemperature = Math.floor(Math.random() * (30 - 20 + 1) + 20); // Generate a random temperature between 20°C and 30°C
    client.publish('agriculture/greenhouse/temperature', randomTemperature.toString());
}, 30000); // Adjust the interval as needed
