let toolbox = null;
let colorP = null;
let helpers = null;

sprayCan = {
    name: "sprayCanTool",
    icon: undefined,
    points: 13,
    spread: 10,
    draw: function(){
        if (mouseIsPressed)
        {
            for(let i = 0; i < this.points; i++)
            {
                point(random(mouseX - this.spread, mouseX + this.spread), 
                      random(mouseY - this.spread, mouseY + this.spread));
            }
        }
    }
};

function setup()
{
    let toolBox = new Toolbox();
    let canvasContainer = select("#content");
    let canvasNew = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
    canvasNew.parent("content");
}

function draw()
{
    
}