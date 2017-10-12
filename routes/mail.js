var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');

/* GET mail page. */
router.get('/', function(req, res, next) {
 	res.render('mail', { title: 'Mail' });
});

router.post('/send', function(req, res, next) {
	let name = req.body.name;
	let email = req.body.email;
	let message = req.body.message;

	// это настройки самого nodemailer
	let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'selkir7@gmail.com', //  А так же нужно разрешить ненадежным приложениям доступ к аккаунту https://myaccount.google.com/lesssecureapps
            pass: "пароль от акка"  // пароль напиши нормальный, сейчас заглушка стоит 
        }
    });

	// грубо говоря это настройки отображения письма
	let mailOptions = {
        from: '"Письмо от 👻" <selkir7@gmail.com>', // sender address
        to: 'Adokers@yandex.ru, jhgbnm1@mail.ru', // list of receivers, можно указать несколько адресов
        subject: 'Заголовок письма ✔', // Subject line
        text: "Текст письма... Имя" + name + "Емайл " + email + "Сообщение " +  message, // plain text body, это тело в заголовке, тоесть идёт сам заголовок большими буквами, и дальше в той же строке заголовка идёт текст маленькими букавами, вот тут прописывается, помоему бесполезная тема, стоит оставлять напримр так "Текст письма...", ну это моё мнение, смотри скрины, я наделал скринов и кинул в ту папку, в которой всякие шпаргалки
        html: "<div>Текст письма...<div><div><ul><li>Имя " + name + "</li><li>Емайл " + email + "</li><li>Сообщение " +  message + "</li></ul></div>" // html body // а это тело самого письма, так же хорошей практикой является небольшая правка отправляемого текста, а именно убрать лишние пробелы в конце сообщения(если они будут) и ещё ограничить кол-во знаков сообщения, что бы нам не прислали какую-нибудь "Войну и мир"(почти шутка), поэтому можно написать например так message.trim().slice(0, 500) , вот такая простая правка, trim() и slice() - обычные встроенные js функции
    };

    // это функция отправки
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
            res.redirect("/");
        }
        console.log('Message sent: %s', info.messageId);
        // console.log('Message sent: %s', info.response); // попробуй

        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // попробуй

        res.redirect("/");
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com> // это результат, вывод в консоль info.messageId
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou... // это результат, вывод в консоль nodemailer.getTestMessageUrl(info), но у меня почему-то вывелось null, но да ладно, это вообще не нужная часть кода
    });
	
 	
});

module.exports = router;