precision mediump int;
attribute vec2 a_Position;
attribute vec4 a_Color;

varying vec4 v_Color;

uniform int u_Renderer;

void main(){
	v_Color = a_Color; // move later
	if(u_Renderer == 0){
		gl_PointSize = 50.0;
	}else if(u_Renderer == 1){

	}else if(u_Renderer == 2){
		
	}
	gl_Position = vec4(a_Position,0.0,1.0);
}