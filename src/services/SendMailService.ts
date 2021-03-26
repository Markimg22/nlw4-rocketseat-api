import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

type variablesType = {
  name: string;
  title: string;
  description: string;
  user_id: string;
  link: string;
}

class SendMailSevice {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass
          }
        });

        this.client = transporter;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async execute(to: string, variables: variablesType, path: string): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse({
      name: variables.name,
      title: variables.title,
      description: variables.description,
      user_id: variables.user_id,
      link: variables.link
    });

    const message = await this.client.sendMail({
      to,
      subject: variables.title,
      html,
      from: 'NPS <noreplay@nps.com.br>'
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailSevice();
