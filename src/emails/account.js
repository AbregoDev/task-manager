const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey);

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