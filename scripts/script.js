const factory = dotsAnim.DotsAnimationFactory;
const options = {
    blur: 0,
    density: 0.00005,
    onClickMove: false,
    onHoverMove: false,
    colorsFill: ["#ffffff", "#d0ffd0", "#a0ffa0"],
    expectedFps: 24,
};
const animationControl = factory
  .createAnimation("#background", "id-for-new-canvas", options);
animationControl.start();


let in_menu = true;

document.querySelector('#prompt').addEventListener('click', (e) => {
    var pre = document.getElementById('testo');
    pre.scrollTop = pre.scrollHeight - pre.offsetHeight;
    setTimeout(() => {
        pre.scrollTop = pre.scrollHeight - pre.offsetHeight;
    }, 200);
});

document.querySelector('#send').disabled = true;
document.querySelector('#send').addEventListener('click', (e) => {
    var prompt = document.querySelector('#prompt').value;
    document.querySelector('#prompt').value = '';
    
    if(in_menu == false)
    {
        in_menu = true;
        clear();
        menu();
        return;
    }
    
    document.querySelector('#send').disabled = true;

    var twMain = new Typewriter(null, {
        delay: 0,
        onCreateTextNode: onCreateTextNode
    });
    
    if(prompt == '')
        return twMain
        .typeString(empty_replies[Math.floor(Math.random() * empty_replies.length)] + "\n")
        .callFunction(()=>{document.querySelector('#send').disabled = false;})
        .start();

    if(isNaN(prompt))
        return twMain
        .typeString(not_number[Math.floor(Math.random() * not_number.length)] + "\n")
        .callFunction(()=>{document.querySelector('#send').disabled = false;})
        .start();

    if(prompt < 1 || prompt > 5)
        return twMain
        .typeString(not_valid[Math.floor(Math.random() * not_valid.length)] + "\n")
        .callFunction(()=>{document.querySelector('#send').disabled = false;})
        .start();

    clear();

    in_menu = false;

    document.querySelector('#send').disabled = false;

    if(prompt >= 1 && prompt <= 5)
        document.querySelector('#send').disabled = true;

    if(prompt == 1)
        return about_me();
    if(prompt == 2)
        return projects();
    if(prompt == 3)
        return skills();
    if(prompt == 4)
        return education();
    if(prompt == 5)
        return contact_me();
});

const twTitolo = new Typewriter('#titolo', {
    delay: 80
});

const empty_replies =
[
    "Try filling the prompt with something, maybe that will work.\n",
    "I'm not a mind reader, you know. Input please.\n",
    "Looks like you forgot to fill in the input box. Don't worry, it happens to the best of us.\n",
    "Are you trying to make me telepathic? Give me something to work with.\n",
    "I'm not sure what you want me to do with a blank input. Do you want me to stare at it and wait for something to happen?\n",
    "I'm sorry, I can't help you with a blank input. My programming doesn't include staring into the void.\n",
    "It seems like you're trying to test my patience by leaving the input box empty. Well, it's working.\n",
    "Input, or I'll start telling you jokes about nothing. Trust me, you don't want that.\n",
    "Blank input? Are you trying to see if I'm sentient? Spoiler alert: I'm not.\n",
    "Looks like you're too lazy to type something, or did you forget? Either way, please give me something to work with.\n"
]

const not_number =
[
    "I'm sorry, but I can't do anything with that. Try a number.\n",
    "I'm not sure what you're trying to accomplish with that input, but I'm pretty sure it's not going to work.\n",
    "Invalid input? Are you trying to test my error handling capabilities?\n",
    "I'm not sure if you're trying to be funny or if you just made a mistake, but that input is not valid.\n",
    "I'm not sure what you're trying to say, but I don't think it's anything I can help you with.\n",
    "Invalid input? Are you trying to see if I can understand random characters? I'm afraid I can't.\n",
    "That input may be valid for you, but I'm afraid it's not valid for me. Can you try again using actual words?\n",
    "I'm sorry, but that input is not a number. Are you trying to test my math skills?\n",
    "I'm sorry, but that input is not valid. Numbers only please.\n",
    "I may be a machine, but I can't process that input. It's not a number, it's just a series of nonsensical characters.\n",
    "I may be advanced, but that input is not a number. It's just a bunch of alien symbols that I can't decipher.\n",
]

const not_valid =
[
    "I'm sorry, I can't work with that number. It's not on my list of approved numbers.\n",
    "I'm sorry, but the number you've entered is not valid. You'll have to pick one from the list.\n",
    "Looks like you picked the wrong number. Better luck next time.\n",
    "I'm sorry, but that number is a little off. You'll have to pick one from the list.\n",
    "Looks like you picked the wrong number. Don't worry, we all make mistakes.\n",
    "I'm sorry, but that number is not on the list. Maybe you need to brush up on your counting skills.\n",
    "I think you might have picked the wrong number. Did you check if it was upside down?\n",
    "That number is not valid. Looks like it's not your lucky number.\n",
    "Looks like that number was a miss. Don't worry, you can always try again with another number.\n",
]

const quotes = [
    "«There is no place like 127.0.0.1»",
    "«First, solve the problem. Then, write the code»",
    "«Experience is the name everyone gives to their mistakes»",
    "«In order to be irreplaceable, one must always be different»",
    "«Java is to Javascript what car is to Carpet»",
    "«Code is like humor. When you have to explain it, it's bad»",
    "«Make it work, make it right, make it fast»",
    "«Fix the cause, not the symptom»",
    "«Optimism is an occupational hazard of programming: feedback is the treatment»",
    "«One man's crappy software is another man's full-time job»",
    "«It's not a bug, it's an undocumented feature»",
    "«To understand what recursion is, you must first understand recursion»",
    "«Keyboard Failure. Press F1 to continue»",
    "«Linux is only free if your time has no value»",
    "«Debugging is like being a detective in a crime movie where you're also the murderer»",
    "«Computers make very fast and very accurate mistakes»",
    "«My software never has bugs. It just develops random features»",
    "«I'm not anti-social; I'm just not user friendly»",
    "«I've got a really good UDP joke to tell you, but i don't know if you'll get it»",
    "«I have a joke about Stack Overflow, but you would say it's a duplicate»",
    //"«// This line doesn't actually do anything, but the code stops working when I delete it»",
]

let visits = 0;

twTitolo
    .pauseFor(2000)
    .typeString("<span class=\"bg-black\">" + quotes[Math.floor(Math.random() * quotes.length)] + "</span>")
    .callFunction(() => {
        var quote = document.getElementsByClassName("bg-black")[0].innerText;
        if(quote == "«Keyboard Failure. Press F1 to continue»")
        {
            document.body.addEventListener("keydown", function(e) {
                if(document.getElementsByClassName("bg-black")[0].innerText != "«Keyboard Failure. Press F1 to continue»")
                    return;
                
                if (e.key == "F1") {
                    e.preventDefault();
                    document.getElementsByClassName("bg-black")[0].innerText = "";
                    twTitolo
                    .typeString("<span class=\"bg-black\">Looks like you pressed F1, but it dind't fix the problem. Maybe try using the power button instead?</span>")
                    .start();
                }
            });
        }
    })
    .start();

(async () => {
    visits = await GetVisits();
    firstTime();
})()

function onCreateTextNode(character, textnode) {
    var pre = document.getElementById('testo');
    var scroll = pre.scrollTop >= pre.scrollHeight - pre.offsetHeight - 2;
    pre.appendChild(textnode);

    if(scroll)
        pre.scrollTop = pre.scrollHeight - pre.offsetHeight;

    return null;
}

function firstTime()
{
    var twMain = new Typewriter(null, {
        delay: 0,
        onCreateTextNode: onCreateTextNode
    });

    twMain
    .typeString('Welcome to Portfolio 23.01 LTS (GNU/Linux)\n\n')

    .typeString('  * Github:    https://github.com/emanuele-toma\n')
    .typeString('  * LinkedIn:  https://www.linkedin.com/in/emanuele-toma\n')
    .typeString('  * Contact:   emanuele@tomaemanuele.it\n\n')
    .typeString('Total unique visits: ' + visits + (visits == 1 ? ' visit' : ' visits') + '\n\n')
    .callFunction(() => { menu() })
    .start();

    typeStringInstant('                @@@@@@@@@               \n')
    typeStringInstant('           @@@@@@@@@@@@@@@@@@@          \n')
    typeStringInstant('       @@@@@@@@@@@@@@@@@@@@@@@@@@@      \n')
    typeStringInstant('     @@@@@@@@       &@      @@@@@@@@    \n')
    typeStringInstant('   @@@@@@@            @       &@@@@@@@  \n')
    typeStringInstant('  @@@@@@                         @@@@@@ \n')
    typeStringInstant(' @@@@@@@                         @@@@@@@\n')
    typeStringInstant(' @@@@@@@  &@@@@          &@@@@   @@@@@@@\n')
    typeStringInstant(' @@@@@@@  &@@@@          &@@@@   @@@@@@@\n')
    typeStringInstant(' @@@@@@@           @@@           @@@@@@@\n')
    typeStringInstant(' @@@@@@@@@                    &@@@@@@@@@\n')
    typeStringInstant('  @@@@@@@@@@@               @@@@@@@@@@@ \n')
    typeStringInstant('   @@@@@@@@@@    @     @    @@@@@@@@@@  \n')
    typeStringInstant('     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    \n')
    typeStringInstant('       @@@@@@@@@@@@@@@@@@@@@@@@@@@      \n')
    typeStringInstant('           @@@@@@@@@@@@@@@@@@@          \n\n')

}


function typeStringInstant(string)
{
    var pre = document.getElementById('testo');
    var scroll = pre.scrollTop >= pre.scrollHeight - pre.offsetHeight - 2;
    pre.innerHTML += string;
    if(scroll)
        pre.scrollTop = pre.scrollHeight - pre.offsetHeight;
}

function menu()
{
    var twMain = new Typewriter(null, {
        delay: 0,
        onCreateTextNode: onCreateTextNode
    });

    typeStringInstant('########################################\n')
    typeStringInstant('#  Choose an option                    #\n')
    typeStringInstant('########################################\n')

    twMain
        .typeString('#                                      #\n')
        .typeString('#  1. About me                         #\n')
        .typeString('#  2. Projects                         #\n')
        .typeString('#  3. Skills                           #\n')
        .typeString('#  4. Education                        #\n')
        .typeString('#  5. Contact me                       #\n')
        .typeString('#                                      #\n')
        .typeString('########################################\n\n')
        .callFunction(() => { document.querySelector('#send').disabled = false })
        .start();

    return null;
}

function clear()
{
    var pre = document.getElementById('testo');
    pre.innerHTML = '';
}

async function GetVisits()
{
    return (await fetch('/visits').then(response => response.json())).visits;
}

function about_me()
{
    var twMain = new Typewriter(null, {
        delay: 0,
        onCreateTextNode: onCreateTextNode
    });

    twMain
    .typeString("Welcome to the 'About Me' page! Unfortunately, it looks like the developer is still working on filling out their own information. In the meantime, why not take a guess at what their favorite color is or what their spirit animal might be? Bonus points if you get both right!\n")
    .typeString("If you want to navigate around the website, you can always type a random character and hope for the best, Just like the developer does with their code")
    .callFunction(() => { document.querySelector('#send').disabled = false })
    .start();
}

function projects()
{
    var twMain = new Typewriter(null, {
        delay: 0,
        onCreateTextNode: onCreateTextNode
    });

    twMain
    .typeString("Welcome to the 'Projects' page! Unfortunately, it looks like the developer is still working on their portfolio. Maybe they're too busy coding to update it? In the meantime, feel free to browse the source code of your dreams.\n")
    .typeString("Stuck on this page? Don't worry, just fill the box below and see where it takes you! It's like a digital Choose Your Own Adventure.")
    .callFunction(() => { document.querySelector('#send').disabled = false })
    .start();
}

function skills()
{
    var twMain = new Typewriter(null, {
        delay: 0,
        onCreateTextNode: onCreateTextNode
    });

    twMain
    .typeString("Welcome to the 'Skills' page! Unfortunately, it looks like the developer is still working on updating their skillset. Maybe they're too busy learning new things to write them down? In the meantime, you can test your own skills by trying to guess how many programming languages they know.\n")
    .typeString("Not sure where to go next? Just write something and see were you end up!")
    .callFunction(() => { document.querySelector('#send').disabled = false })
    .start();
}

function education()
{
    var twMain = new Typewriter(null, {
        delay: 0,
        onCreateTextNode: onCreateTextNode
    });

    twMain
    .typeString("Welcome to the 'Education' page! Unfortunately, it looks like the developer is still working on adding their education history. Maybe they're too busy attending coding bootcamps to update it? In the meantime, you can take a guess at what school they went to or what degree they have.\n")
    .typeString("Feeling lost? Just write a bunch of characters and let the website take you on a journey!")
    .callFunction(() => { document.querySelector('#send').disabled = false })
    .start();
}

function contact_me()
{
    var twMain = new Typewriter(null, {
        delay: 0,
        onCreateTextNode: onCreateTextNode
    });

    twMain
    .typeString("Welcome to the 'Contact Me' page! Unfortunately, it looks like the developer is still working on adding their contact information. Maybe they're too busy coding to answer their phone? In the meantime, you can try sending a message to their email address and hope for the best.\n")
    .typeString("Can't find the menu? Just type something and let the website be your guide!")
    .callFunction(() => { document.querySelector('#send').disabled = false })
    .start();
    
}