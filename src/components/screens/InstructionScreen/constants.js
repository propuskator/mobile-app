import config       from '../../../config';

import TelegramIcon from '../../../assets/static_icons/telegram_icon.svg';

export const LINKS = {
    '@propuskator_bot' : 'https://t.me/propuskator_bot'
};

export function getInstructionStructure(type, lang) {
    const API_URL = config.API_URL;

    const INSTRUCTION_STRUCTURE = {
        telegram : {
            header : {
                icon  : TelegramIcon,
                title : 'Telegram bot'
            },
            content : {
                1 : {
                    title  : 'To connect to the bot, follow the @propuskator_bot link or enter the bot name in the search for the Telegram application.',
                    images : [
                        `${API_URL}/instructions/telegram/${lang}/1.1.png`
                    ]
                },
                2 : {
                    title  : 'Press the ”Start” button - the bot will give a greeting and tell you about the commands that you can use in your work.',
                    images : [
                        `${API_URL}/instructions/telegram/${lang}/2.1.png`
                    ]
                },
                3 : {
                    title  : 'For authorization, select or manually enter the /login command - the bot will ask you to enter the name of your workspace, email and password in the Propuskator.',
                    images : [
                        `${API_URL}/instructions/telegram/${lang}/3.1.png`
                    ]
                },
                4 : {
                    title  : 'After successful authorization, a button with the main bot command - /access_points will appear at the bottom of the screen',
                    images : [
                        `${API_URL}/instructions/telegram/${lang}/4.1.png`
                    ]
                },
                5 : {
                    title  : 'Click the /access_points button or enter the command manually - a list of access points linked to your account will open. Closed access points are marked with a red icon, opened (if there are any) - green.',
                    images : [
                        `${API_URL}/instructions/telegram/${lang}/5.1.png`
                    ]
                },
                6 : {
                    title  : 'In order to open the desired access point, click on its name. The color of the icon will change to green, and the bot will confirm the action with the message “Successfully On”.',
                    images : [
                        `${API_URL}/instructions/telegram/${lang}/6.1.png`
                    ]
                },
                7 : {
                    title  : 'To close the access point, click on its name again. The icon will turn red and the bot will display a “Successfully Off” message.',
                    images : [
                        `${API_URL}/instructions/telegram/${lang}/7.1.png`
                    ]
                },
                8 : {
                    title  : 'To run the help for all commands, enter the /help command.',
                    images : [
                        `${API_URL}/instructions/telegram/${lang}/8.1.png`
                    ]
                },
                9 : {
                    title  : 'To log out of your account, select or manually enter the /logout command. The bot will confirm the action with the message “Successfully logged out”.',
                    images : [
                        `${API_URL}/instructions/telegram/${lang}/9.1.png`
                    ]
                }
            }
        }
    };

    return INSTRUCTION_STRUCTURE[type];
}
