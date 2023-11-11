const { Client } = require("discord.js-selfbot-v13");
const config = require("./config");
const client = new Client({
  checkUpdate: false,
});
let key = config.discord; //bot token
let channelID = config.channelID; //channel ID
let reactChance = 0.3; //chance for the bot to react to a message
let messUpChance = 0.05; //chance for the bot to mess up
let lastSent = -2; // define last sent number because it is used in an if statement before assignment (-2 is used because the first number is 0)

/**
 * Checks if a string is a positive number while also allowing for '+-/*.' characters, Must also start with a number
 * Note: does not currently allow for roots using the ^ sign.
 * @code
 * isValid("+123") // false
 *
 * isValid("12.32") // true
 *
 * isValid("1+23") // true
 * @endcode
 *
 * @param {string} str
 * @returns {boolean} true if the string is numeric, false otherwise
 */
const isValid = (str) => {
  if (str[0] < "0" || str[0] > "9") {
    //if the first character is not a number
    return false;
  }
  for (let i = 1; i < str.length; i++) {
    //loop through the rest of the string
    if (!"0123456789+-/*.".includes(str[i])) {
      //If the character is not a number or an operator
      return false;
    }
  }
  return true;
};

console.log("Starting...");

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`); //log that the bot is up and running
});

client.on("messageCreate", async (message) => {
  //when a message is sent
  if (message.author.id == client.user.id) {
    //if the message was sent by the bot
    return;
  } else if (message.channel.id == channelID) {
    //if the message was sent in the counting channel
    let number = message.content.replace("^", "**"); //replace the ^ sign with ** so that the bot can evaluate powers
    if (isValid(number) ? eval(number) == lastSent + 1 : false) {
      //if the message is a valid number and it is the next number in the sequence
      lastSent = eval(number); //set the last sent number to the current number
      if (Math.random() <= reactChance) {
        //chance for the bot to react
        setTimeout(() => {
          //wait a random amount of time between 250ms and 1000ms
          log = eval(number) + 1 + ""; //set the log to the next number in the sequence and turn it into a string
          if (Math.random() <= messUpChance) {
            //chance for the bot to mess up
            log = "​" + (+number + 1); //set the log to the next number in the sequence but with a zero width space at the start so no one can tell the bot messed up <evil laugh>
            message.channel
              .send(log) //send the message
              .then((msg) => {
                //react to the message with a ✅ to imply that the bot is correct
                msg.react("✅");
              })
              .catch(console.error); //log any errors
          } else {
            message.channel.send(log); //send a normal message
          }
          console.log(
            `Sent message: ${log} in channel: ${message.channel.name} in guild: ${message.guild.name} as a response to: ${message.author.username}: ${message.content}` //log the message
          );
        }, 250 + 750 * Math.random());
      }
    }
  }
});

client.login(
  //login to the bot
  key
);
