class Drawing {
    constructor( idOfOverviewSVG ) {

        this.id = idOfOverviewSVG;
        this.svg = document.getElementById( idOfOverviewSVG );
        var v = this.svg.getAttribute( "viewBox").split(" ");
        this.view = {
            x: parseInt(v[0]),
            y: parseInt(v[1]),
            width: parseInt(v[2]),
            height: parseInt(v[3]),
        }
        this.mouseDown = 0;

        this.svg.onmousemove = (event) => { this.onMouseMove(event); }
        this.svg.onmousewheel = (event) => { this.onMouseWheel(event); } 
        this.svg.onmousedown = (event) => { this.onMouseDown(event); } 
        this.svg.onmouseup = (event) => { this.onMouseUp(event); }
    }

    onMouseMove( event )
    {
        if (this.mouseDown == 1) {
            this.view.x += event.movementX;
            this.view.y += event.movementY;

            this.svg.setAttribute("viewBox", `${this.view.x} ${this.view.y} ${this.view.width} ${this.view.height}`);
          }
    }

    onMouseWheel( event )
    {
        var z = -event.deltaY / 10;
        this.view.x += z;
        this.view.y += z;
        this.view.width -= z*2;
        this.view.height -= z*2;

        this.svg.setAttribute("viewBox", `${this.view.x} ${this.view.y} ${this.view.width} ${this.view.height}`);
    }

    onMouseDown( event )
    {
        this.mouseDown = event.which;
    }

    onMouseUp( event )
    {
        this.mouseDown = 0;
    }
}

module.exports = Drawing;
