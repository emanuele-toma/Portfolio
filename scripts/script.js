// Listen up folks, these variables are off limits. Think of them like a fancy art exhibit you can look, but don't even think about touching.
(async () => {

    ///////////////
    //   SNAKE   //
    ///////////////
    var _snake = null;

    function _snakeUp(e) {
        _snake.Up();
    }

    function _snakeDown(e) {
        _snake.Down();
    }

    function _snakeLeft(e) {
        _snake.Left();
    }

    function _snakeRight(e) {
        _snake.Right();
    }

    function snake() {
        _snake = new Snake(document.querySelector('.tw_testo'));

        document.querySelector('#btn-controller-up').addEventListener('click', _snakeUp);
        document.querySelector('#btn-controller-down').addEventListener('click', _snakeDown);
        document.querySelector('#btn-controller-left').addEventListener('click', _snakeLeft);
        document.querySelector('#btn-controller-right').addEventListener('click', _snakeRight);

        document.getElementById("form").classList.add("d-none");
        document.getElementById("controller").classList.remove("d-none");
        twMain.pasteString('Loading sssnek...');
        twMain.start();

        setTimeout(() => {
            _snake.Start();

            _snake.onGameOver = async (score, win) => {
                var buttons = document.querySelectorAll('#controller > div > button');

                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].classList.add('text-lime');
                    buttons[i].classList.remove('bg-lime');
                }

                document.getElementById("controller").classList.add("d-none");

                document.querySelector('#btn-controller-up').removeEventListener('click', _snakeUp);
                document.querySelector('#btn-controller-down').removeEventListener('click', _snakeDown);
                document.querySelector('#btn-controller-left').removeEventListener('click', _snakeLeft);
                document.querySelector('#btn-controller-right').removeEventListener('click', _snakeRight);

                document.getElementById("form").classList.remove("d-none");

                clearTesto();

                if (win)
                    twMain.pasteString("Congratulations! You won!\n");
                else
                    twMain.pasteString("Game Over\n");

                var highscore = localStorage.getItem('snake_highscore');
                var previousScore = highscore;
                if (highscore == null || highscore < score) {
                    localStorage.setItem('snake_highscore', score);
                    twMain.pasteString("\nNew highscore!");
                    twMain.pasteString("\nPrevious highscore: " + previousScore);
                } else {
                    twMain.pasteString("\nHighscore: " + localStorage.getItem('snake_highscore'));
                }

                twMain.pasteString("\nCurrent score: " + score);
                twMain.pasteString("\n\nInsert coin to continue...");
                twMain.pasteString("\nJust kidding, type 'snake' to play again\n");
                twMain.pasteString("\nOr type anything else to exit...\n");
                twMain.start();

            }

            _snake.onDirectionChange = async (direction) => {
                var buttons = document.querySelectorAll('#controller > div > button');

                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].id == 'btn-controller-' + direction) {
                        buttons[i].classList.remove('text-lime');
                        buttons[i].classList.add('bg-lime');
                    } else {
                        buttons[i].classList.add('text-lime');
                        buttons[i].classList.remove('bg-lime');
                    }
                }
            }

        }, 500);
    }


    ///////////////
    //   DOTS    //
    ///////////////


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

    ///////////////
    //   MENU    //
    ///////////////

    let in_menu = true;
    let contact_menu = false;

    contact_data = {
        'name': null,
        'email': null,
        'message': null,
        'captcha_id': null,
        'captcha_solution': null
    }

    document.querySelector('#send').disabled = true;

    document.querySelector('#send').addEventListener('click', async (e) => {
        var prompt = document.querySelector('#prompt').value;
        document.querySelector('#prompt').value = '';
        document.querySelector('#send').disabled = true;

        if (contact_menu == true) {

            prompt = prompt.trim();

            if (prompt == '$exit') {
                contact_data = {
                    'name': null,
                    'email': null,
                    'message': null,
                    'captcha_id': null,
                    'captcha_solution': null
                }

                contact_menu = false;
                clearTesto();
                menu();
                return;
            }

            if (contact_data.name == null) {
                if (prompt.length < 3) {
                    twMain
                        .typeString("Well, if your first name is that short then please at least add your last name...\n")
                        .callFunction(() => { document.querySelector('#send').disabled = false; })
                        .start();
                    return;
                }

                if (prompt.length > 50) {
                    twMain
                        .typeString("You must be kidding me... Your parents must have hated you for giving a name that long!\n")
                        .callFunction(() => { document.querySelector('#send').disabled = false; })
                        .start();
                    return;
                }

                if (/\d/.test(prompt)) {
                    twMain
                        .typeString("Unless you're the son of Elon Musk I don't think your name contains numbers.\n")
                        .callFunction(() => { document.querySelector('#send').disabled = false; })
                        .start();
                    return;
                }

                contact_data.name = prompt;
                twMain
                    .typeString("You have passed the first test, now something harder.\n")
                    .typeString("What's your email?\n")
                    .callFunction(() => { document.querySelector('#send').disabled = false; })
                    .start();
                return;
            }

            if (contact_data.email == null) {
                regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!regex.test(prompt)) {
                    twMain
                        .typeString("Pretty sure you know what an email address looks like, just type yours so I can actually reply to you.\n")
                        .callFunction(() => { document.querySelector('#send').disabled = false; })
                        .start();

                    return;
                }

                contact_data.email = prompt;
                twMain
                    .typeString("You're almost there, now just tell me what you want to say.\n")
                    .callFunction(() => { document.querySelector('#send').disabled = false; })
                    .start();

                return;
            }

            if (contact_data.message == null) {
                if (prompt.length < 10) {
                    twMain
                        .typeString("You can't be serious, you're not going to send me a message that short.\n")
                        .callFunction(() => { document.querySelector('#send').disabled = false; })
                        .start();

                    return;
                }

                if (prompt.length > 1000) {
                    twMain
                        .typeString("You're not going to send me a message that long, I'm not going to read it.\n")
                        .callFunction(() => { document.querySelector('#send').disabled = false; })
                        .start();

                    return;
                }

                if (!isNaN(prompt)) {
                    twMain
                        .typeString("You're not going to send me a message that's just a number, I'm not going to read it.\n")
                        .callFunction(() => { document.querySelector('#send').disabled = false; })
                        .start();

                    return;
                }

                contact_data.message = prompt;

                var captcha_text = null;

                if (contact_data.captcha_id == null) {
                    var captcha = await fetch('/captcha', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => response.json());

                    captcha_text = captcha.text;
                    contact_data.captcha_id = captcha.id;
                }

                twMain
                    .typeString("Now it's the final stage, try beating the captcha and your message will be sent!\n")
                    .typeString("\n")
                    .typeString("Find the value of x in the following equation:\n")
                    .typeString(captcha.text + "\n")
                    .typeString("\n")
                    .callFunction(() => { document.querySelector('#send').disabled = false; })
                    .start();



                return
            }

            if (contact_data.captcha_solution == null) {
                var captcha_solution = prompt;

                var response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: contact_data.name,
                        email: contact_data.email,
                        message: contact_data.message,
                        captcha_id: contact_data.captcha_id,
                        captcha_solution: captcha_solution
                    })
                })
                    .then(response => response.json());

                if (response.success == true) {
                    twMain
                        .typeString("Thank you, the email has been sent. I'll try to reply to you ASAP!\n")
                        .typeString("As always, you can type anything to go back to the main menu.\n")
                        .callFunction(() => {
                            document.querySelector('#send').disabled = false;
                            contact_data = {
                                'name': null,
                                'email': null,
                                'message': null,
                                'captcha_id': null,
                                'captcha_solution': null
                            }

                            contact_menu = false;
                        })
                        .start();
                    return;
                }

                contact_data.captcha_id = null;
                var captcha_text = null;

                if (contact_data.captcha_id == null) {
                    var captcha = await fetch('/captcha', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json());

                    contact_data.captcha_id = captcha.id;
                    captcha_text = captcha.text;
                }

                twMain
                    .typeString("The captcha was wrong, try again. I know you can do it!\n")
                    .typeString("\n")
                    .typeString("Find the value of x in the following equation:\n")
                    .typeString(captcha.text + "\n")
                    .typeString("\n")
                    .callFunction(() => { document.querySelector('#send').disabled = false; })
                    .start();

                return;
            }

            return;
        }

        if (prompt == 'snake') {
            clearTesto();
            in_menu = false;
            document.querySelector('#send').disabled = false;
            return snake();
        }

        if (in_menu == false) {
            in_menu = true;
            clearTesto();
            return menu();
        }

        if (prompt == '')
            return twMain
                .typeString(empty_replies[Math.floor(Math.random() * empty_replies.length)] + "\n")
                .callFunction(() => { document.querySelector('#send').disabled = false; })
                .start();

        if (isNaN(prompt))
            return twMain
                .typeString(not_number[Math.floor(Math.random() * not_number.length)] + "\n")
                .callFunction(() => { document.querySelector('#send').disabled = false; })
                .start();

        if (prompt < 1 || prompt > 5)
            return twMain
                .typeString(not_valid[Math.floor(Math.random() * not_valid.length)] + "\n")
                .callFunction(() => { document.querySelector('#send').disabled = false; })
                .start();

        clearTesto();

        in_menu = false;

        document.querySelector('#send').disabled = false;

        if (prompt >= 1 && prompt <= 5)
            document.querySelector('#send').disabled = true;

        if (prompt == 1)
            return about_me();
        if (prompt == 2)
            return projects();
        if (prompt == 3)
            return skills();
        if (prompt == 4)
            return education();
        if (prompt == 5)
            return contact_me();
    });

    const twTitolo = new Typewriter('#titolo', {
        delay: 80,
        wrapperClassName: 'tw_titolo',
        cursorClassName: 'tw_cursor',
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
            "Looks like you're too lazy to type something, or did you forget? Either way, please give me something to work with.\n",
            "Instead of leaving the input box empty, why don't you try playing snake? Just type 'snake' to play!.\n",
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
            "Well, that's not a number. Bored yet? Try playing snake! Just type 'snake' to play!.\n"
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
            "That number is a bit off. If you don't want to pick one from the list, you can always play snake! Just type 'snake' to play!.\n"
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
        .typeString("<span class=\"bg-black\">" + quotes[Math.floor(Math.random() * quotes.length)] + "</span>")
        .callFunction(() => {
            var quote = document.getElementsByClassName("bg-black")[0].innerText;
            if (quote == "«Keyboard Failure. Press F1 to continue»") {
                document.body.addEventListener("keydown", function (e) {
                    if (document.getElementsByClassName("bg-black")[0].innerText != "«Keyboard Failure. Press F1 to continue»")
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

    var twMain = new Typewriter('#testo', {
        delay: 0,
        onCreateTextNode: onCreateTextNode,
        wrapperClassName: "tw_testo",
        cursorClassName: "tw_cursor",
    });

    function onCreateTextNode(character, textnode) {
        var pre = document.getElementById('testo');

        if (pre.scrollHeight - pre.clientHeight <= pre.scrollTop + 1) {
            setTimeout(() => {
                pre.scrollTop = pre.scrollHeight - pre.clientHeight;
            }, 10);
        }

        return textnode;
    }

    document.querySelector('#prompt').addEventListener('click', (e) => {
        var pre = document.querySelector('#testo');
        const TIME_TO_LOAD_KEYBOARD = 200;

        if (pre.scrollHeight - pre.clientHeight <= pre.scrollTop + 1)
            setTimeout(() => {
                pre.scrollTop = pre.scrollHeight - pre.clientHeight;
            }, TIME_TO_LOAD_KEYBOARD);
    });

    function firstTime() {

        twMain
            .start()
            .pasteString('                @@@@@@@@@               \n')
            .pasteString('           @@@@@@@@@@@@@@@@@@@          \n')
            .pasteString('       @@@@@@@@@@@@@@@@@@@@@@@@@@@      \n')
            .pasteString('     @@@@@@@@       &@      @@@@@@@@    \n')
            .pasteString('   @@@@@@@            @       &@@@@@@@  \n')
            .pasteString('  @@@@@@                         @@@@@@ \n')
            .pasteString(' @@@@@@@                         @@@@@@@\n')
            .pasteString(' @@@@@@@  &@@@@          &@@@@   @@@@@@@\n')
            .pasteString(' @@@@@@@  &@@@@          &@@@@   @@@@@@@\n')
            .pasteString(' @@@@@@@           @@@           @@@@@@@\n')
            .pasteString(' @@@@@@@@@                    &@@@@@@@@@\n')
            .pasteString('  @@@@@@@@@@@               @@@@@@@@@@@ \n')
            .pasteString('   @@@@@@@@@@    @     @    @@@@@@@@@@  \n')
            .pasteString('     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    \n')
            .pasteString('       @@@@@@@@@@@@@@@@@@@@@@@@@@@      \n')
            .pasteString('           @@@@@@@@@@@@@@@@@@@          \n')
            .pasteString('\n')
            .typeString('Welcome to Portfolio 23.01 LTS (GNU/Linux)\n\n')
            .typeString('  * Github:    <i><a href="https://github.com/emanuele-toma" target="_blank">github.com/emanuele-toma</a></i>\n')
            .typeString('  * LinkedIn:  <i><a href="https://www.linkedin.com/in/emanuele-toma" target="_blank">linkedin.com/in/emanuele-toma</a></i>\n')
            .typeString('  * Contact:   <i><a href="mailto:emanuele@tomaemanuele.it" target="_blank">emanuele@tomaemanuele.it</a></i>\n\n')
            .typeString('Total unique visits: ' + visits + (visits == 1 ? ' visit' : ' visits') + '\n\n');

        menu();
    }

    function menu() {
        twMain
            .pasteString('########################################\n')
            .pasteString('#  Choose an option                    #\n')
            .pasteString('########################################\n')
            .pasteString('#                                      #\n')
            .typeString('#  1. About me                         #\n')
            .typeString('#  2. Projects                         #\n')
            .typeString('#  3. Skills                           #\n')
            .typeString('#  4. Education                        #\n')
            .typeString('#  5. Contact me                       #\n')
            .pasteString('#                                      #\n')
            .pasteString('########################################\n')
            .pasteString('\n')
            .callFunction(() => { document.querySelector('#send').disabled = false })
            .start();

        return null;
    }

    function clearTesto() {
        document.querySelector('.tw_testo').innerText = "";
    }

    async function GetVisits() {
        return (await fetch('/visits').then(response => response.json())).visits;
    }

    function about_me() {
        twMain
            .typeString("\n")
            .typeString("Connecting to Police database...\n")
            .pauseFor(1000)
            .typeString("Connected!\n")
            .typeString("Uploading custom payload...\n")
            .typeString("Retrieving data...\n")
            .typeString("Hacking complete!\n")
            .pauseFor(1000)
            .typeString("Targets found: 1 Target\n\n")
            .pasteString("Full Name: Emanuele Toma\n")
            .pasteString("Current Age: " + Math.floor((new Date() - new Date(2003, 11, 3)) / 31536000000) + "\n")
            .pasteString("Occupation: Student\n\n")
            .pasteString("Approximate Location: Bergamo, Italy\n")
            .pasteString("Location Accuracy: 6km\n\n")
            .pasteString("Eye Color: Brown\n")
            .pasteString("Hair Color: Brown\n")
            .pasteString("Height: 1.78m\n\n")
            .pasteString("Police Record: None\n\n")
            .pasteString("Interests: Programming, Music, Gaming, Web Development, Cybersecurity, Linux and more!\n")
            .pasteString("Favourite Color: #5D3FD3\n")
            .pasteString("Snake Highscore: 63 (Try beating it! Just type 'snake' to play!)\n")
            .pasteString("Favourite Programming Language: Javascript\n")
            .pasteString("Email: emanuele@tomaemanuele.it\n\n")
            .pauseFor(3000)
            .pasteString("Warning: Breach detected!\n\n")
            .pauseFor(1000)
            .typeString("Well, well, well, look who decided to take a little peek into my personal information!\n")
            .typeString("I, the all-powerful developer, have intercepted your sneaky little hack attempt and have now successfully stolen all of your precious data.\n")
            .typeString("You thought you could outsmart me?\n")
            .typeString("Ha! I've got your name, age, occupation, location, physical characteristics, and even your interests and favorite colors.\n")
            .typeString(localStorage.getItem('snake_highscore') !== null ? "Oh, and let's not forget about that impressive snake highscore of yours.\n" : "")
            .typeString(localStorage.getItem('snake_highscore') !== null ? "I'll definitely have to challenge you to a game sometime.\n" : "")
            .typeString("But don't worry, I won't tell the police about your little escapade.\n")
            .typeString("Consider this a warning: never mess with a developer's information.\n")
            .typeString("You have been warned.\n\n")
            .typeString("Anyways if you want to get back to the main menu, just type something in the box below.\n")
            .callFunction(() => { document.querySelector('#send').disabled = false })
            .start()
    }

    function projects() {
        twMain
            .typeString("Looks like you stumbled upon my little corner of the internet where I showcase all of my awesome projects.\n")
            .typeString("Let's see, we've got my <b>Portfolio</b>, where I flaunt my skills and interests to the world, built entirely in JavaScript and HTML.\n")
            .typeString("Then there's <b>SubdomainProxy</b>, a slick little Node.js application that redirects requests based on the subdomain.\n")
            .typeString("Moving on, I've got <b>GeoPopulation</b>, a handy tool that provides an API for extracting random coordinates from around the world, all built with Python.\n")
            .typeString("And let's not forget about <b>Tomessenger</b>, my simple server chat using sockets.\n")
            .typeString("Or <b>MirrorView</b>, my template engine for JS that uses syntax similar to PHP.\n\n")
            .typeString("All in all, a pretty impressive lineup if I do say so myself.\n\n")
            .typeString("But don't take my word for it, why don't you check them out for yourself?\n")
            .typeString("Now, you may be thinking to yourself, 'wow, this developer sure has a lot of impressive projects.'\n")
            .typeString("But, hold your horses there buddy, because this list might be incomplete.\n")
            .typeString("You see, I am a developer, and as all developers know, we can be quite lazy at times.\n")
            .typeString("So, don't be surprised if you don't find all of my projects listed here.\n")
            .typeString("But fear not, because I've left a little surprise for you.\n\n")
            .typeString("If you're feeling adventurous, go on a hunt for my super secret Easter egg.\n")
            .typeString("It'll take you on a journey through my <a href=\"https://github.com/emanuele-toma\" target\"_blank\">Github</a> activity in 2021, where you'll find something waiting for you.\n")
            .typeString("Good luck, and happy hunting!\n\n")
            .typeString("You might want to go back to the main menu, if that's what you're looking for, just type something in the box below.\n")
            .callFunction(() => { document.querySelector('#send').disabled = false })
            .start();
    }

    function skills() {
        twMain
            .typeString("Ladies and gentlemen, step right up and behold the skills of the one and only developer!\n")
            .typeString("I am a programming wizard, with proficiency in C#, Python, Javascript, HTML (Not an actual programming language), and CSS.\n")
            .typeString("For the entire list just visit my Github profile, I\'m too lazy to type it all out.\n")
            .typeString("I can speak English and Italian fluently, so communication is never an issue.\n")
            .typeString("But it's not just technical skills that I possess, oh no.\n")
            .typeString("I am also a master of soft skills, such as teamwork, problem solving, adaptability, conflict management, and time management.\n")
            .typeString("I am the complete package, the whole enchilada, the cherry on top of the sundae.\n")
            .typeString("With me on your team, you'll be laughing all the way to the bank, or at least laughing at my terrible jokes.\n\n")
            .typeString("Maybe you're lost, or maybe not. Either way, you can always go back to the main menu by typing something in the box below.\n")
            .callFunction(() => { document.querySelector('#send').disabled = false })
            .start();
    }

    function education() {
        twMain
            .typeString("Ah, the education section.\n")
            .typeString("The place where I tell you all about my time at the Hogwarts of computer science, otherwise known as I.T.I.S. Pietro Paleocapa in Bergamo, Italy.\n")
            .typeString("I spent 6 long years there, and let me tell you, it felt like an eternity.\n")
            .typeString("But, in all seriousness, it was an amazing experience.\n")
            .typeString("Everyone knew me thought i was like a computer science wizard, which sounds impressive, but really just means that whenever anyone had a problem with their computer, they would come to me.\n")
            .typeString("But, I digress.\n")
            .typeString("The main courses of study during my time there were networking, C# desktop and Asp.net, with a smattering of C++ and Java.\n")
            .typeString("Unfortunately, there were almost no girls in the school, but I suppose that's just the price you pay for being a computer science wizard.\n")
            .typeString("Overall, my education at the computer science high school in Bergamo, Italy, was a crucial step in my journey to becoming the highly skilled and well-rounded developer that I am today.\n")
            .typeString("But, I'm sure you're wondering, what about my education after high school?\n")
            .typeString("Well, I'm glad you asked.\n")
            .typeString("I haven't actually started university yet, but I'm planning on studying computer science at the Bicocca University in Milan.\n")
            .typeString("Either that or I'll just keep coding and hope for the best.\n\n")
            .typeString("Bored yet? Well, you can always go back to the main menu by typing something in the box below.\n")
            .callFunction(() => { document.querySelector('#send').disabled = false })
            .start();
    }

    function contact_me() {
        twMain
            .typeString("Welcome to the contact me section!\n")
            .typeString("This is where you can reach out to your favorite developer and tell them all about your amazing ideas, job offers, or just to say hi.\n")
            .typeString("Just fill out your name, email, and message, and then complete the weird captcha.\n")
            .typeString("If you're lucky, I'll actually receive your message and respond back to you.\n")
            .typeString("But beware, if you make any mistakes, the website might get angry and you'll never hear from me again.\n")
            .typeString("And let's not forget about the weird captcha, it's like a test to see if you're actually a real person or just a robot trying to spam me.\n")
            .typeString("So, go ahead and give it a shot, and let's see if you have what it takes to reach out to me.\n\n")
            .typeString("If you change your mind, you can always go back to the main menu by typing '$exit' in the box below.\n")
            .typeString("I know, I know, you aren't used to type something specific, but trust me, typing '$exit' to go back to the main menu is way more exciting than just typing some random stuff.\n\n")
            .typeString("Let's start with something simple, what's your name?\n")
            .callFunction(() => { contact_menu = true })
            .callFunction(() => { document.querySelector('#send').disabled = false })
            .start();
    }
})();