const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'abre.go@outlook.com',
        subject: 'Thanks for joining!',
        text: `Welcome, ${name}. I'm glad you join this wonderful community`,
    });
}

const sendByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'abre.go@outlook.com',
        subject: 'We\'ll mess you!',
        text: `We sorry you have to go, ${name}. Could you provide some feedback?`,
    });
}

// sendWelcomeEmail('L16361058@tehuacan.tecnm.mx', 'John Doe');

module.exports = {
    sendWelcomeEmail,
    sendByeEmail,
};