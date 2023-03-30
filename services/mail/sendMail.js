const Mailjet = require('node-mailjet');

module.exports = ()=>{}

// const mailjet = new Mailjet({
//     apiKey: 'apikey',
//     apiSecret: 'apikey'
// });

// module.exports = async (users, body) => {
//     try {
//         await mailjet.post("send", { 'version': 'v3.1' })
//             .request({
//                 "Messages": [
//                     {
//                         "From": {
//                             "Email": "mail",
//                             "Name": "Mailjet Pilot"
//                         },
//                         "To": users,
//                         "Subject": "hello",
//                         "HTMLPart": body
//                     }
//                 ]
//             });
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
