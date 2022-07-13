precision mediump int;
attribute vec2 a_Position;

uniform int u_Renderer;

void main(){
	if(u_Renderer == 0){
		gl_PointSize = 50.0;
	}
	gl_Position = vec4(a_Position,0.0,1.0);
}