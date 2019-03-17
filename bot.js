// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes, MessageFactory } = require('botbuilder');
// Create an array with the valid color options.

let notificationActions;
let notificationMsg;
let defaultOptions = ['Yes','No'];
let confirmationRequired;
class MyBot {
   
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            const text = turnContext.activity.text;

            // If the `text` is in the Array, a valid color was selected and send agreement.
            if (notificationActions.includes(text)) {
                await this.sendSuggestedActions(turnContext,defaultOptions,`Do you wish to continue with option "${ text }"?.`);
            }else if(defaultOptions.includes(text) && text == defaultOptions[0]){
                //call direct line api to send info 
                await turnContext.sendActivity(`Proceeding with action ${ text }.`);
                // get response and show to user.
                notificationMsg = '';
                console.log('Actioned');
            } else if(notificationMsg == ''){
                await this.sendWelcomeMessage(turnContext);
            }else{
                await turnContext.sendActivity('Please select a valid option.');
            }

            // After the bot has responded send the suggested actions.
            //await this.sendWelcomeMessage(turnContext);
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
            console.log(turnContext.activity.type);
            console.log(turnContext.activity);
            await this.sendWelcomeMessage(turnContext);
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected.]`);
        }
    }

    /**
     * Send a welcome message along with suggested actions for the user to click.
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    async sendWelcomeMessage(turnContext) {
        const activity = turnContext.activity;
        //Check for notification
        //{"nofication": [{"id":"123","lvl_option":["Set To zero","Set to a value"],"confirmation_req":["Y","Y"]}]};
        notificationActions = ['Set To zero','Action Later'];
        confirmationRequired = ['Y','Y']; 
        notificationMsg = 'SOH mismatch stock not found in store for the article 15311, Do you like to action it ?';
        if (activity.membersAdded) {
            
        }
         if (activity.membersAdded) {
            // Iterate over all new members added to the conversation.
            for (const idx in activity.membersAdded) {
                if (activity.membersAdded[idx].id !== activity.recipient.id) {
                    /* const welcomeMessage = `Welcome to suggestedActionsBot ${ activity.membersAdded[idx].name }. ` +
                        `This bot will introduce you to Suggested Actions. ` +
                        `Please select an option:`; */
                    await turnContext.sendActivity(notificationMsg);
                    await this.sendSuggestedActions(turnContext,notificationActions, 'Please select an option.');
                }
            }
        }
    }

    /**
     * Send suggested actions to the user.
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    async sendSuggestedActions(turnContext,notificationActions,msg) {
        var reply = MessageFactory.suggestedActions(notificationActions,msg);
        await turnContext.sendActivity(reply);
    }

}

module.exports.MyBot = MyBot;
