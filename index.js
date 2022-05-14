import platform from "../img/platform.png";
import hills from "../img/hills.png";
import background from "../img/background.png";
import platformSmallTall from "../img/platformSmallTall.png";

//Player looks, has copyright
import spriteRunLeft from "../img/spriteRunLeft.png";
import spriteRunRight from "../img/spriteRunRight.png";
import spriteStandLeft from "../img/spriteStandLeft.png";
import spriteStandRight from "../img/spriteStandRight.png";

const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

//Hace q el width y height se predeterminen
canvas.width = 1024;
canvas.height = 576;

//Creating Gravity
const gravity = 0.5;

//Creating the player
class Player {
    constructor() {
        this.speed = 10;
        this.position = {
            x: 100,
            y: 100,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = 66;
        this.height = 150;

        this.image = createImage(spriteStandRight);
        this.frames = 0;
        this.sprite = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66,
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875,
            },
        };

        this.currentSprite = this.sprite.stand.right;
        this.currentCropWidth = 177;
    }

    draw() {
        // c.fillStyle = "red";
        //Posiciona el player en cierto espacio de la pantalla
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    //Constanstly updates so it will work on time
    update() {
        this.frames++;
        if (
            this.frames > 59 &&
            (this.currentSprite === this.sprite.stand.right ||
                this.currentSprite === this.sprite.stand.left)
        )
            this.frames = 0;
        else if (
            this.frames > 29 &&
            (this.currentSprite === this.sprite.run.right ||
                this.currentSprite === this.sprite.run.left)
        ) {
            this.frames = 0;
        }
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        //Conditional to improve gravity
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity;
        else this.velocity.y = 0;
    }
}

class Platform {
    constructor({ x, y }) {
        this.position = {
            x,
            y,
        };

        this.image = image;

        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
        // c.fillStyle = "blue";
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class GenericObject {
    constructor({ x, y }) {
        this.position = {
            x,
            y,
        };

        this.image = image;

        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
        // c.fillStyle = "blue";
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

function createImage(imageSrc) {
    const image = new image();
    image.src = imageSrc;
    return image;
}

let platformImage = createImage(platform);
let platadormSmallTallImage = createImage(platformSmallTall);

//Object player
let player = new Player();
// const platform = new Platform();
let platforms = [];
let genericObjects = [];

let currentKey;

//Keys
const keys = {
    rigth: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
};

//how far has the player moved
let scrollOffset = 0;

function Init() {
    platformImage = createImage(platform);

    //Object player
    player = new Player();
    // const platform = new Platform();
    platforms = [
        new Platform({
            x: platformImage.width * 4 +
                300 -
                2 +
                platformImage.width -
                platadormSmallTallImage.width,
            y: 270,
            image: platadormSmallTallImage,
        }),
        new Platform({
            x: -1,
            y: 470,
            image: platformImage,
        }),
        new Platform({
            x: platformImage.width - 3,
            y: 470,
            image: platformImage,
        }),
        new Platform({
            x: platformImage.width * 2 + 200,
            y: 470,
            image: platformImage,
        }),
        new Platform({
            x: platformImage.width * 3 + 300,
            y: 470,
            image: platformImage,
        }),
        new Platform({
            x: platformImage.width * 4 + 300 - 2,
            y: 470,
            image: platformImage,
        }),
        new Platform({
            x: platformImage.width * 5 + 700 - 2,
            y: 470,
            image: platformImage,
        }),
    ];
    genericObjects = [
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage(background),
        }),
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage(hills),
        }),
    ];

    //how far has the player moved
    scrollOffset = 0;
}

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "white";
    c.clearRect(0, 0, canvas.width, canvas.height);

    genericObjects.forEach((genericObject) => {
        genericObject.draw();
    });

    platforms.forEach((platform) => {
        platform.draw();
    });

    player.update();

    //Movement right - left
    if (keys.rigth.pressed && player.position.x < 400) {
        player.velocity.x = player.speed;
    } else if (
        (keys.left.pressed && player.position.x > 100) ||
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
    ) {
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;

        if (keys.rigth.pressed) {
            scrollOffset += 5;

            platforms.forEach((platform) => {
                platform.position.x -= player.speed;
            });

            genericObjects.forEach((genericObject) => {
                genericObject.position.x -= player.speed * 0.6;
            });
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed;

            platforms.forEach((platform) => {
                platform.position.x += player.speed;
            });

            genericObjects.forEach((genericObject) => {
                genericObject.position.x += player.speed * 0.6;
            });
        }

        if (scrollOffset > platformImage.width * 5 + 400 - 2) {
            //You win
        }

        if (player.position.y > canvas.height) {
            //You lose
            Init();
        }
    }

    //Collition with platadorm - platform collition detection
    platforms.forEach((platform) => {
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >=
            platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        )
            player.velocity.y = 0;
    });

    if (
        keys.rigth.pressed &&
        currentKey === "right" &&
        player.currentSprite !== player.sprite.run.right
    ) {
        player.frames = 1;
        player.currentSprite = player.sprite.run.right;
        player.currentCropWidth = player.sprite.stand.cropWidth;
        player.width = player.sprite.stand.width;
    } else if (
        keys.left.pressed &&
        currentKey === "left" &&
        player.currentSprite !== player.sprite.run.left
    ) {
        player.currentSprite = player.sprite.run.left;
        player.currentCropWidth = player.sprite.run.cropWidth;
        player.width = player.sprite.run.width;
    } else if (!keys.left.pressed &&
        currentKey === "left" &&
        player.currentSprite !== player.sprite.stand.left
    ) {
        player.currentSprite = player.sprite.stand.left;
        player.currentCropWidth = player.sprite.stand.cropWidth;
        player.width = player.sprite.stand.width;
    } else if (!keys.rigth.pressed &&
        currentKey === "right" &&
        player.currentSprite !== player.sprite.stand.right
    ) {
        player.currentSprite = player.sprite.stand.right;
        player.currentCropWidth = player.sprite.stand.cropWidth;
        player.width = player.sprite.stand.width;
    }
}

Init();
animate();

//Calls a function when the keydown is pressed
addEventListener("keydown", ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            //Left (A)
            keys.left.pressed = true;
            currentKey = "left";
            break;
        case 83:
            //Down (S)
            break;
        case 68:
            //Rigth (D)
            // player.velocity.x = 1;
            keys.rigth.pressed = true;
            currentKey = "right";
            break;
        case 87:
            //Up (W)
            player.velocity.y -= 25;
            break;
    }
});

addEventListener("keyup", ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            //Left (A)
            keys.left.pressed = false;
            player.currentSprite = player.sprite.stand.left;
            player.currentCropWidth = player.sprite.stand.cropWidth;
            player.width = player.sprite.stand.width;
            break;
        case 83:
            //Down (S)
            break;
        case 68:
            //Rigth (D)
            // player.velocity.x = 0;
            keys.rigth.pressed = false;
            player.currentSprite = player.sprite.stand.right;
            player.currentCropWidth = player.sprite.stand.cropWidth;
            player.width = player.sprite.stand.width;
            break;
        case 87:
            //Up (W)
            break;
    }
});

//