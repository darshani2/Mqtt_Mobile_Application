var mqtt = require('mqtt');
var nodemailer = require('nodemailer');


var mqttOptions = {
    host: 'first-7bq3gk.a02.usw2.aws.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'udSewwandi',
    password: 'SLT567intern'
};


var client = mqtt.connect(mqttOptions);


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sewwandidarshani95@gmail.com',
        pass: 'nxkh uins swso fxqu'
    }
});


function sendEmailNotification(temperature, message) {
    var mailOptions = {
        from: 'sewwandidarshani95@gmail.com',
        to: 'rathnappayasee@gmail.com', 
        subject: 'Greenhouse Temperature Alert',
        text: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}


client.on('connect', function () {
    console.log('Connected to MQTT broker');
    
    client.subscribe('agriculture/greenhouse/temperature');
});

client.on('error', function (error) {
    console.error('MQTT error:', error);
});

client.on('message', function (topic, message) {
    
    console.log('Received message:', topic, message.toString());

    
    var temperature = parseFloat(message.toString());

    
    if (!isNaN(temperature)) {
        if (temperature > 27) {
            sendEmailNotification(temperature, `High Greenhouse Temperature Alert: The temperature is high (${temperature}°C). Please activate the ventilation system to cool the greenhouse.`);
        } else if (temperature < 15) {
            sendEmailNotification(temperature, `Low Greenhouse Temperature Alert: The temperature is low (${temperature}°C). Please activate the heater to maintain optimal conditions.`);
        }
    }
});


setInterval(function () {
    var randomTemperature = Math.floor(Math.random() * (30 - 10 + 1) + 10); 
    client.publish('agriculture/greenhouse/temperature', randomTemperature.toString());
}, 30000); 
