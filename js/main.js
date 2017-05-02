//var game = new Phaser.Game(gameSet);

var gameSet={
	width: 1920,
  height: 1080,
}
var game = new Phaser.Game(gameSet.width,gameSet.height,Phaser.CANVAS,"",{preload:preload, create:create, update:update});
var gamesNext=false
var score_a = 0;
var score_b = 0;

var ball=function(x,y,style,drag,bx){

	this.sprite = game.add.sprite(x, y, style);
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

	this.sprite.body.collideWorldBounds = true;

	if(drag){
		this.sprite.inputEnabled = true;
		this.sprite.input.enableDrag();
		this.sprite.input.priorityID = 10;

		bounds = new Phaser.Rectangle(bx, 20, 940, 1040);
		graphics = game.add.graphics(bounds.x, bounds.y);
		graphics.beginFill(0x000077);
		graphics.drawRect(0, 0,  bounds.width, bounds.height);
		graphics.alpha=0;
		this.sprite.input.boundsRect = bounds;
	}
	return this.sprite
}

function preload() {
	game.load.image('yellow', 'assets/yellow.png');
	game.load.image('red', 'assets/red.png');
	game.load.image('blue', 'assets/blue.png');
	game.load.image('back', 'assets/background.svg');

	var style = { font: "bold 500px Arial", fill: 'rgba(255,255,255,0.4)', boundsAlignH: "center", boundsAlignV: "middle" };

	text_a = game.add.text(0, 0, "0", style);
	text_a.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
	text_a.setTextBounds(200, 500, 500, 100);

	text_b = game.add.text(0, 0, "0", style);
	text_b.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
	text_b.setTextBounds(1200, 500, 500, 100);

};

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.stage.disableVisibilityChange = true;
	game.input.mouse.capture = true;
	game.stage.backgroundColor = '#273d4a';
	game.add.sprite(0,0, 'back');

	blueBall=new ball(0,0,'blue',true,20)
	yellowBall=new ball(0,0,'yellow',false)
	redBall=new ball(0,0,'red',true,960)

	blueBall.body.moves=false

	yellowBall.body.bounce.setTo(1);

	blueBall.body.immovable = true;
	redBall.body.immovable = true;

	game.canvas.addEventListener('mousedown', requestLock);
	game.input.addMoveCallback(move, this);


	iniGame()
};

function requestLock() {
    game.input.mouse.requestPointerLock();
}

function move(pointer, x, y) {

    if (game.input.mouse.locked)
    {
        blueBall.x += game.input.mouse.event.movementX;
        blueBall.y += game.input.mouse.event.movementY;
				if(blueBall.x<20) blueBall.x = 20;
				else if(blueBall.x>840) blueBall.x = 840;
				console.log(blueBall.y)
				if(blueBall.y<80) blueBall.y = 80;
				else if(blueBall.y>1010) blueBall.y = 1010	;
    }

}

function iniGame(){
	blueBall.x=190
	blueBall.y=gameSet.height/2
	blueBall.anchor.setTo(0, 0.5);
	yellowBall.x=445
	yellowBall.y=gameSet.height/2
	yellowBall.anchor.setTo(0, 0.5);
	redBall.x=1620
	redBall.y=gameSet.height/2
	redBall.anchor.setTo(0, 0.5);
}
function collision(e){
	yellowBall.body.moves=true
	yellowBall.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(game.physics.arcade.angleBetween(e,yellowBall)* 180 / Math.PI, 1500));
}


function update() {
	if(yellowBall.x>1850){
		score_a ++;
		text_a.setText(score_a);
		gamesNext=true
	}else if(yellowBall.x==0||yellowBall.x<0){
		score_b ++;
		text_b.setText(score_b);
		gamesNext=true
	}
	if(gamesNext){
		yellowBall.body.moves=false
		yellowBall.body.velocity.setTo(0)
		gamesNext=false
		iniGame()
	}else{
		game.physics.arcade.collide([blueBall,redBall],yellowBall, collision, null, this);
		if(yellowBall.x>960&&yellowBall.body.velocity.x>20){

			game.physics.arcade.moveToXY(redBall,yellowBall.x-30,yellowBall.y,2000)
			if(redBall.x-yellowBall.x<40){
				game.physics.arcade.moveToXY(redBall,1920,yellowBall.y,2000)
			}
		}else{
			game.physics.arcade.moveToXY(redBall,1920,yellowBall.y,500)
		}
	}
}
