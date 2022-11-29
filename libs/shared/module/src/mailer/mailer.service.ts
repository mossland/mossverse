import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Id, LogService } from "@shared/util-server";
import { AxiosInstance } from "axios";
import { MailerOptions } from "../option";
import { webcrypto } from "crypto";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport = require("nodemailer/lib/smtp-transport");
@Injectable()
export class MailerService extends LogService {
  mailer: Transporter<SMTPTransport.SentMessageInfo>;
  constructor(@Inject("MAILER_OPTIONS") private options: MailerOptions) {
    super(MailerService.name);
    this.mailer = createTransport(options);
  }
  async sendMail(mail: { to: string; subject: string; html: string }) {
    const res = await this.mailer.sendMail({ ...mail, from: this.options.address });
    return true;
  }
  async sendPasswordResetMail(to: string, password: string) {
    const html = getHtmlContent(to, password);
    await this.sendMail({ to, subject: "Password Reset", html });
    return true;
  }
}
export const getHtmlContent = (id: string, password: string) => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>weekly report</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td>
                  You can access the MIB with the temporarily issued password. Please change your password after logging in.<br />     
                  <br />
                  Email : ${id}
                  <br />
                  Temporal Password: ${password}
                </td>
            </tr>
        </table>
        </body>
    </html>
    `;
};
