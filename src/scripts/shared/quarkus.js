import {BayesClassifier} from "natural"
import {random} from "@/scripts/shared/random-between";

const messageClassifier = new BayesClassifier();

const trainingData = [
    {
        tag: "casual/hello",
        messages: [
            "Hi!",
            "Hello!",
            "Good morning!",
            "Ni hao",
            "Ohayoo",
            "Hai",
            "Helow",
        ]
    },

    {
        tag: "casual/bye",
        messages: [
            "Bye",
            "bb",
            "Good bye",
            "Good night",
            "Bye-bye!",
        ]
    },

    {
        tag: "casual/name",
        messages: [
            "What is your name?",
            "What's your name?",
            "Hi! What is your name?",
            "Can I ask you for your name?",
            "Name?",
        ]
    },

    {
        tag: "casual/thanks",
        messages: [
            "ty",
            "thx",
            "tysm",
            "thanks",
            "thank you",
            "muchos gracias",
            "merci",
            "Thank you very much!",
            "I appreciate it!",
            "Thank you a lot!",
        ]
    },

    {
        tag: "query/add column",
        messages: [
            "Can you add a column?",
            "Add a column",
            "Add column to a table, please",
            "Can you put a new column into a table?"
        ],
    },

    {
        tag: "query/change in",
        messages: [
            "Can you perform the changing?",
            "Can you change some rows?",
            "Change rows",
            "Can you change in a table?"
        ],
    },

    {
        tag: "query/change port to",
        messages: [
            "Can you change port?",
            "I need to change the port",
            "Change a port",
            "Can you set a new port number of the server?"
        ],
    },

    {
        tag: "query/clear database",
        messages: [
            "Can you clear a database?",
            "Clear a database",
            "Clear database",
            "Empty a database",
            "Remove all the tables",
            "Delete all the tables from database",
            "Trash all the tables from database",
        ],
    },

    {
        tag: "query/clear table",
        messages: [
            "Clear table",
            "Remove all the records from table",
            "Flush table",
            "Delete all the records inside the table"
        ],
    },

    {
        tag: "query/clone database",
        messages: [
            "Clone database",
            "Copy database",
            "Can you clone the database?",
            "Clone all the tables to a new database"
        ],
    },

    {
        tag: "query/clone table",
        messages: [
            "Clone table",
            "Can you clone the table",
            "Please copy a table",
            "Clone the table",
        ],
    },

    {
        tag: "query/clone table scheme",
        messages: [
            "Can you copy the table but clear the copied one?",
            "So can you clone the table scheme?",
            "Copy a table but with no rows",
            "Clone the table but without rows",
            "I need to copy the table scheme",
            "Copy table scheme"
        ],
    },

    {
        tag: "query/create database",
        messages: [
            "Can you create a database?",
            "Create a database",
            "Make a new database",
            "Generate a new database",
            "Create a new database",
            "Brand new database",
        ],
    },

    {
        tag: "query/create table",
        messages: [
            "Can you create a database",
            "I need a brand new table",
            "Make a new table, please",
            "Create a table"
        ],
    },

    {
        tag: "query/create token",
        messages: [
            "Can you make a token?",
            "Please, create a token",
            "Create a new token",
            "Generate a new access token"
        ],
    },

    {
        tag: "query/delete column",
        messages: [
            "Can you delete a column?",
            "Can you drop the column from the table",
            "Can you remove the column?",
            "Delete a column"
        ],
    },

    {
        tag: "query/delete database",
        messages: [
            "Can you delete a database?",
            "Drop database, please",
            "Remove the database",
            "Get rid of the database"
        ],
    },

    {
        tag: "query/delete from",
        messages: [
            "Can you delete some rows from the table?",
            "Remove from the table",
            "Delete from the table",
            "I need to drop some records from the table"
        ],
    },

    {
        tag: "query/delete table",
        messages: [
            "Can you delete table?",
            "Delete table",
            "Delete a table",
            "Remove a table",
            "Can you remove a table",
            "Remove a table, please",
            "Delete a table, please",
            "Delete the table",
            "Destroy the table",
            "Drop the table"
        ],
    },

    {
        tag: "query/factory reset",
        messages: [
            "Factory reset",
            "I need to reset my server",
            "Can you reset this server?",
            "I need to reinstall my server",
            "Back to factory settings"
        ],
    },

    {
        tag: "query/grant token",
        messages: [
            "Grant token",
            "Can you add a permission to a token?",
            "Extend the token's privilege",
            "Add a new right to an access token"
        ],
    },

    {
        tag: "query/insert into",
        messages: [
            "Create a row",
            "Make a row",
            "Insert into a table",
            "Can you please insert a row?",
            "Insert a row"
        ],
    },

    {
        tag: "query/list columns in",
        messages: [
            "List columns",
            "Can you show me all the columns in the table?",
            "What are columns in the table?"
        ],
    },

    {
        tag: "query/list databases",
        messages: [
            "List databases",
            "Show me all the databases in the table",
            "Can you list databases from the server?"
        ],
    },

    {
        tag: "query/list tables in",
        messages: [
            "List tables in database",
            "Can you show me all the tables in the database?",
            "Show tables",
            "List of all the tables",
        ],
    },

    {
        tag: "query/redefine column",
        messages: [
            "Can you redefine a column?",
            "Can you change a type of the column",
            "Can you add a new modifier to a column?",
            "I need to set a new type of the column",
        ],
    },

    {
        tag: "query/reload server",
        messages: [
            "Can you reload a server?",
            "I need to reload the server",
            "Rerun the server",
            "Relaunch the server"
        ],
    },

    {
        tag: "query/rename column",
        messages: [
            "Can you rename a column?",
            "Can you please rename a column?",
            "Change name of a column"
        ],
    },

    {
        tag: "query/rename database",
        messages: [
            "Rename a database",
            "Can you please set a new name of the database?",
            "I need to change a name of the database"
        ],
    },

    {
        tag: "query/rename server to",
        messages: [
            "Can you rename server?",
            "I need to change the name of the database",
            "Can you please change the database name?"
        ],
    },

    {
        tag: "query/rename table",
        messages: [
            "Rename table",
            "I need to change the table name",
            "Can you set a new name for a table?"
        ],
    },

    {
        tag: "query/reorder columns in",
        messages: [
            "Change order in columns",
            "Can you reorder columns?",
            "I need to reorder all the columns in the table"
        ],
    },

    {
        tag: "query/run command",
        messages: [
            "Can you run a command?",
            "Please, launch a command",
            "Run a command"
        ],
    },

    {
        tag: "query/schedule command",
        messages: [
            "Schedule command",
            "Can you plan a command to be run in schedule?",
            "Create a command with an interval"
        ],
    },

    {
        tag: "query/schedule query",
        messages: [
            "Can you schedule a query?",
            "Can you plan a query to run scheduled?",
            "Run instruction with a schedule",
            "Interval query run",
        ],
    },

    {
        tag: "query/select from",
        messages: [
            "Can you select some data from the table?",
            "Pick some rows from the table",
            "List all the rows meet the condition",
            "Select from a table"
        ],
    },

    {
        tag: "query/stop server",
        messages: [
            "Can you stop the server?",
            "Halt the server",
            "Exit the server",
        ],
    },

    {
        tag: "query/swap columns in",
        messages: [
            "Can you swap columns?",
            "I need to swap 2 columns in the table"
        ],
    },

    {
        tag: "query/ungrant token",
        messages: [
            "Can you remove permission of token?",
            "Ungrant token",
            "Delete a privilege of an access token"
        ],
    },
]

const answers = [
    {
        tag: "idk",
        messages: [
            "I am not sure what are you talking about. I am still in Beta so I can be stupid sometimes - it's my right! :<",
            "Hmm... It's hard to understand what do you mean. I think it's my fault... :( I am sorry, I am still in Beta",
            "Sadly, I don't understand...",
            "I am so sorry! I don't have any idea what you are talking about...",
            "Sorry :( I can't understand you..."
        ],
    },

    {
        tag: "casual/hello",
        messages: [
            "Hi there!",
            "Hello :)",
            "Hello!",
            "Hey",
            "Howdy!",
            "Greetings!",
            "Nice to see you!",
            "Hey!",
            "Heyoo!",
            "Good afternoon, sir!",
            "Long time no see!"
        ],
    },

    {
        tag: "casual/bye",
        messages: [
            "Bye-bye...",
            "Bye",
            "Goodbye",
            "Have a good one",
            "See ya",
            "See you next time :)",
            "Sad you go :("
        ],
    },

    {
        tag: "casual/name",
        messages: [
            "My name is Quarkus!",
            "I'm Quarkus!",
            "I am Quarkus!",
            "Quarkus :)",
            "I was named Quarkus",
        ],
    },

    {
        tag: "casual/thanks",
        messages: [
            "You are welcome!",
            "Not a big deal, to be honest!",
            "Ask me again! I'd like to help you again :)",
            "It's nothing :)",
            "Forget it :P",
            "My pleasure, sir!",
            "No worries!",
            "No problem!"
        ],
    },

    {
        tag: "query/add column",
        messages: [
            "So you want me to add a new column to an existing table?",
            "You need to add a column to a table, am I right?",
            "So you want a new column?"
        ],
    },

    {
        tag: "query/change in",
        messages: [
            "So you want to change some records in a table?",
            "You need to change some records from your table that meets the condition?"
        ],
    },

    {
        tag: "query/change port to",
        messages: [
            "You wanna change port of the server?",
            "So I need to change a port of the server to a new one?"
        ],
    },

    {
        tag: "query/clear database",
        messages: [
            "Want to clear a database?",
            "I need to clear the database? I mean to delete all the tables from it"
        ],
    },

    {
        tag: "query/clear table",
        messages: [
            "Wanna remove all the records from a table?",
            "Do you want to clear a table?"
        ],
    },

    {
        tag: "query/clone database",
        messages: [
            "So you want to clone a database?",
            "Want to copy the database with all the tables inside?"
        ],
    },

    {
        tag: "query/clone table",
        messages: [
            "So you want to clone a table?",
            "Do you want to copy a table to a new one with all the records?"
        ],
    },

    {
        tag: "query/clone table scheme",
        messages: [
            "Want to clone a table, but remove all the records in the new table?",
            "Wanna clone table, but delete all the rows from it, right?"
        ],
    },

    {
        tag: "query/create database",
        messages: [
            "Do you want to create a database?",
            "Wanna create a new database?"
        ],
    },

    {
        tag: "query/create table",
        messages: [
            "Need a new table?",
            "Do you need a brand-new table, am I right?"
        ],
    },

    {
        tag: "query/create token",
        messages: [
            "Do you need a new token?",
            "So you need a new access token for this server, aren't you?"
        ],
    },

    {
        tag: "query/delete column",
        messages: [
            "Wanna delete a column from a table?",
            "Do I need drop an existing column from a table?"
        ],
    },

    {
        tag: "query/delete database",
        messages: [
            "Need to delete a database?",
            "So do you want to wholly delete some database?"
        ],
    },

    {
        tag: "query/delete from",
        messages: [
            "Want to delete some rows from a table?",
            "Do you want to drop records in a table that meets the condition?"
        ],
    },

    {
        tag: "query/delete table",
        messages: [
            "Need to get rid of a table?",
            "Do you want to delete a table?",
            "So I need to remove a table from a database, yes?"
        ],
    },

    {
        tag: "query/factory reset",
        messages: [
            "Wait... You need to factory reset!?",
            "Stop right here... You need to backup the server to settings before the installation?",
            "No way! You want to reset the server?"
        ],
    },

    {
        tag: "query/grand token",
        messages: [
            "Do you need to add a permission to a token?",
            "So you want me to add a new privilege to a token?"
        ],
    },

    {
        tag: "query/insert into",
        messages: [
            "Need to add a row to your table?",
            "Wanna insert a record to a table, huh?"
        ],
    },

    {
        tag: "query/list columns in",
        messages: [
            "You want to see what columns are in a table?",
            "Wanna know what columns are inside the table?"
        ],
    },

    {
        tag: "query/list databases",
        messages: [
            "Wanna see all the databases?",
            ""
        ],
    },

    {
        tag: "query/list tables in",
        messages: [
            "Do you need to see all the tables in a database?",
        ],
    },

    {
        tag: "query/redefine column",
        messages: [
            "Do you need to change a column definition?",
        ],
    },

    {
        tag: "query/reload server",
        messages: [
            "Do you need to reload a server?",
        ],
    },

    {
        tag: "query/rename column",
        messages: [
            "Wanna rename a column?",
        ],
    },

    {
        tag: "query/rename database",
        messages: [
            "So you need to rename a database?",
        ],
    },

    {
        tag: "query/rename server to",
        messages: [
            "You need to rename server?",
        ],
    },

    {
        tag: "query/rename table",
        messages: [
            "Wanna rename a table?",
        ],
    },

    {
        tag: "query/reorder columns in",
        messages: [
            "You want me to reorder columns inside a table?",
        ],
    },

    {
        tag: "query/run command",
        messages: [
            "Run a command? Hmm...",
        ],
    },

    {
        tag: "query/schedule command",
        messages: [
            "Do you need to schedule a command?",
        ],
    },

    {
        tag: "query/schedule query",
        messages: [
            "Wanna plan a query to run?",
        ],
    },

    {
        tag: "query/select from",
        messages: [
            "Select data from a table? Uh-huh...",
        ],
    },

    {
        tag: "query/stop server",
        messages: [
            "Stop a server? Woah...",
        ],
    },

    {
        tag: "query/swap columns in",
        messages: [
            "Swap two columns? Ha!",
        ],
    },

    {
        tag: "query/ungrand token",
        messages: [
            "Do you need to remove a permission from a token?",
        ],
    },
]

trainingData.forEach(messageGroup => {
    messageGroup.messages.forEach(message => {
        messageClassifier.addDocument(message, messageGroup.tag);
    })
})

messageClassifier.train();

/**
 * Returns a tag of the response message
 * judging by the natural message in English.
 *
 * "Can you, please, delete the table" -> "instruction.delete table"
 *
 * @param requestInEnglish
 */
export function askQuarkusFor(requestInEnglish) {
    let guessedTag = messageClassifier.getClassifications(requestInEnglish)[0].label

    guessedTag = guessedTag ? guessedTag : "idk"

    for(const answerGroup of answers) {
        if(answerGroup.tag === guessedTag) {
            console.log(answerGroup.messages)
            return answerGroup.messages[random(0, answerGroup.messages.length - 1)]
        }
    }

    return guessedTag
}