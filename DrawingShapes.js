"use strict";

var canvas;
var gl;

var maxNumVertices  = 200;
var index = 0;
var count = 0;

var cindex = 0;
var sindex;
var numVertices;

var fill = true;

var colors = [

    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0)   // cyan
];
var t;
var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var m = document.getElementById("mymenu");
	var ms = document.getElementById("shapemenu");
	var b = document.getElementById("Button2");
	
    m.addEventListener("click", function() {
       cindex = m.selectedIndex;
        });
		
	ms.addEventListener("click", function(){
		sindex = ms.selectedIndex;
		
		if(sindex == 0)
	{
		numVertices = 4;
	}else if(sindex == 1)
	{
		numVertices = 3;
	}else if(sindex == 2)
	{
		numVertices = 2;
	}
	});
	
	
	//toggle fill
	b.onclick = function(event) {

	 fill = !fill;
	 
	 render();
	 
	}
	

    canvas.addEventListener("mousedown", function(event){
  
		t  = vec2(2*event.clientX/canvas.width-1,
           2*(canvas.height-event.clientY)/canvas.height-1);
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

        t = vec4(colors[cindex]);

        gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

        numIndices[numPolygons]++;
        index++;
		count++;

		if(count == 4 && numVertices == 4)
		{
			numPolygons++;
			numIndices[numPolygons] = 0;
			start[numPolygons] = index;
			count = 0;
			render();
		}
		if(count == 3 && numVertices == 3)
		{
			numPolygons++;
			numIndices[numPolygons] = 0;
			start[numPolygons] = index;
			count = 0;
			render();
		}
		if(count == 2 && numVertices == 2)
		{
			numPolygons++;
			numIndices[numPolygons] = 0;
			start[numPolygons] = index;
			count = 0;
			render();
		}
	
		
    } );
	
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
		if(fill)
		{

			for(var i=0; i<numPolygons; i++) {
				if(numIndices[i] == 2)
				{
					 gl.drawArrays( gl.LINE_LOOP, start[i], numIndices[i] )
				}
				else{
					gl.drawArrays( gl.TRIANGLE_FAN, start[i], numIndices[i] );
				}
        
			}
		}
		else{
			for(var i=0; i<numPolygons; i++) {
        gl.drawArrays( gl.LINE_LOOP, start[i], numIndices[i] );
			}	
		}
}
