import nodeMailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
class MailService {
   constructor() {
      this.transporter = nodeMailer.createTransport({
         host: 'mail2.gov74.ru',
         port: 25,
         secure: false,
         auth: {
            user: 'dev-public@gov74.ru',
            pass: '7qlu7T8V'
         },
         ignoreTLS:true,
         requireTLS:false,
         debug: true
      });
   }
   async newUser(to, password) {
      await this.transporter.sendMail({
         from: 'dev-public@gov74.ru',
         to: to,
         text: '',
         subject: `Центр коммуникаций Правительства Челябинской области: Новый пользователь`,
         html:
            `<div>
               <h3>Для Вас создана учетная запись</h3>
               <p>Логин: ${to}</p>
               <p>Пароль: ${password}</p>
               <p>Ссылка для входа в систему: <a href="http://localhost:3000">http://localhost:3000</a></p>
            </div>`
      });
   }

   async restoreLink(to, link, date){
      await this.transporter.sendMail({
         from: process.env.SMTP_USER,
         to: to,
         text: '',
         subject: `${process.env.APP_NAME}: Запрос на восстановление пароля`,
         html:
            `<div>
               <h3>Запрос действителен до ${date.toLocaleString("ru-RU")}</h3>
               <p>Для восстановления пароля пройдите по ссылке: <a href="${link}">${process.env.APP_NAME}</a></p>
            </div>`
      });
   }
}

export default new MailService();