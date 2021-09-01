require('dotenv').config();

let base_url = process.env.EMAIL_LINK
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

exports.actionReminder = ( period ) => {
    let url = base_url + '/tasks/assigned';
    
    let today = new Date();
    today.setDate(today.getDate() + period);

    let days = period == 1 ? 'day' : 'days';
    let day = today.toLocaleString('en-US', options);

    let lapse = `${ period } ${days}, on ${day}`;
    
    return {
        subject : `PSW pending actions reminder - ${period} ${days} left`,
        html : `
        <!DOCTYPE html
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">

        <head>

            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>New Waiver Template</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style type="text/css">
                body {
                    font-family: arial, 'helvetica neue', helvetica, sans-serif;
                    width: 100%;
                    height: 100%;
                    border-left: 10px;
                    margin-top: 10px;
                }

                .logo-image {
                    height: 50px !important;
                    width: auto;
                    vertical-align: middle;
                }

                .logo-title {
                    color: rgb(0, 0, 92);
                    font-size: 20px;
                    font-weight: 600;
                    margin-top: 15px;
                    margin-bottom: 15px;
                }

                .logo {
                    margin-left: 10px;
                }

                .content {
                    margin-left: 8px;
                }

                .welcome {
                    font-weight: 300;
                    font-size: 18px;
                    color: black;
                }

                .text {
                    font-size: 16px;
                    font-weight: 300;
                }

                .ref {
                    background-color: rgb(38, 42, 105);
                    border: none;
                    color: white;
                    padding: 10px 16px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 5px;
                }

                .ref:hover {
                    cursor: pointer;
                }

                .invisible-a {
                    text-decoration: none;
                }

                .marked {
                    font-family: Arial Bold, Arial, sans-serif;
                    font-weight: bold;
                }

                .mention{
                    color:rgb(0, 0, 100);
                    font-family: Arial Bold, Arial, sans-serif;
                    font-weight: bold;
                    text-decoration: underline;
                }

                .button {
                    border-radius: 2px;
                }

                .button a {
                    padding: 8px 12px;
                    border: 1px solid rgb(38, 42, 105);
                    border-radius: 2px;
                    font-family: Helvetica, Arial, sans-serif;
                    font-size: 14px;
                    color: #ffffff;
                    text-decoration: none;
                    font-weight: bold;
                    display: inline-block;
                }

                .separator{
                    border-left: 10px solid #ffffff;
                    border-right: 10px solid #ffffff;
                }
            </style>
        </head>

        <body>
            <div>
                <table>
                    <tr>
                        <td valign="top" style="vertical-align:top;">
                            <img src="https://i.ibb.co/ZYgG6j2/logo-removebg-preview.png"
                                width="50" height="50">
                        </td>
                        <td valign="middle">
                            <span class="logo-title"> Waiver Requests System - PSW </span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="content">
                <h4 class="welcome">Hello, teammate </h4>
                <p class="text">
                    You have pending actions that are about to expire in ${ lapse }.
                </p>
                <p class="text">
                    Please take care of these actions as soon as possible in order to fulfil the PSW.
                </p>
                <p class="text">
                    You can review these activities by clicking in the buttons below
                </p>

                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="button" bgcolor="#262a69">
                                        <a class="link" href="${ url }" target="_blank">
                                            See pending actions
                                        </a>
                                    </td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </body>

        </html>
        `
    };
}