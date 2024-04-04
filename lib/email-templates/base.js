export const baseEmail = `
<!doctype html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
        <base target="_blank">

        <style>
            /* CSS stylings */

            .content {
                color: #444;
                padding: 10px;
                padding-left: 0;
            }

            .link {
                color: #0055d4;
                text-decoration: none;
            }

            .link:hover {
                color: #111;
            }
            
            .button {
                display: inline-block;
                color: #fff !important;
                text-decoration: none !important;
                background-color: #0055d4;
                border-radius: 3px;
                padding: 10px 20px;
                margin-top: 15px;
                margin-bottom: 15px;
                font-weight: bold;
            }

            .button:hover {
                background-color: #111;
            }
            .hr {
                border: none;
                border-top: 1px solid #efefef;
                color: #efefef;
                overflow: visible;
                text-align: center;
                height: 1px;
            }
        </style>
    </head>
    <body style="background-color: #F0F1F3;font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, sans-serif;font-size: 15px;line-height: 26px;margin: 0;color: #444;">
        <div class="gutter" style="padding: 30px;">&nbsp;</div>
        <div class="wrap" style="background-color: #fff;padding: 30px;max-width: 525px;margin: 0 auto;border-radius: 5px;">
        <div class="header" style="margin-bottom: 20px;">
                <img src="https://linkborgcdn.xpri.dev/mails/thumb_favicon.png" alt="LinkBorg Logo" style="display: inline; height: 30px; vertical-align: middle; margin-right: 10px;" />
                <h1 style="display: inline; vertical-align: middle; font-size: 20px;">LinkBorg</h1>
          
            </div>
            <hr class="hr" />
            <div class="content">
                {{upperContent}}
            </div>
            <a class="button" href="{{url}}">
                {{buttonText}}
            </a>
            <div class="content">
                {{lowerContent}}
            </div>
        </div>
        
        <div class="footer" style="text-align: center;font-size: 12px;color: #888;">
            <p>&copy; <a href="https://linkb.org" target="_blank" style="color: #888;">linkborg</a>&middot; Made with ❤️ in 🇮🇳</p>
        </div>
        <div class="timestamp" style="text-align: center;font-size: 8px;color: #aaa;">
            {{dateTime}}
        </div>
    </body>
    </html>
`;