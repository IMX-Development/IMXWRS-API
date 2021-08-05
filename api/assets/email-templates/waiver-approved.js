require('dotenv').config();

let base_url = process.env.EMAIL_LINK

exports.waiverApproved = (user,id, oldId, team, customer, createdOn) =>{
    let url = base_url + '/waivers/view/' + id;
    createdOn = new Date(createdOn).toString();
    if(Array.isArray(team)){
        if(team.length > 1){
            team = team.slice(0, -1).join(',')+' and '+ team.slice(-1);
        }else if(team.length > 0){
            team = team[0];
        }else{
            team = '';
        }
    }

    return {
        subject: customer + ' ' + id + ' succesfully approved.',
        html: `
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
                    font-family: Arial Bold, Arial, sans-serif; font-weight: bold;
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
                
                .new{
                    text-decoration: underline;
                    font-weight: bolder;
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
                            <span class="logo-title"> Waiver Requests System </span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="content">
                <h4 class="welcome">Hello, ${ user }</h4>
                <p class="text">
                    Your <span class="marked">${ customer }</span> waiver request with number <span class="marked">${ oldId }</span>  created on ${ createdOn }
                    has been fully acknowledged. <br>The corresponding unique new number is <span class="marked new">${ id }</span> 
                </p>
                <p class="text">
                    Please coordinate with <span class="marked"> ${ team } </span> in order to fully complete this waiver request.
                </p>
                <p class="text">
                    You can check its status by clicking in the button below.
                </p>

                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="button" bgcolor="#262a69">
                                        <a class="link" href="${ url }" target="_blank">
                                            See status
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