#extension GL_OES_standard_derivatives : enable
precision mediump int;

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif


uniform int u_Renderer;

float myLinearStep(float edge, float antiAliaingLength,float x){
	return clamp((x-(edge-antiAliaingLength))/(antiAliaingLength),0.0,1.0);
}

void main(){
	
	if(u_Renderer == 0){
		float myDistance = distance(gl_PointCoord,vec2(0.5));
		float fade = length(vec2(dFdx(myDistance), dFdy(myDistance)));

		// step-alpha increases (step-visibility increases) as instance increases
		float alpha = myLinearStep(0.5,fade*1.4,myDistance);

		gl_FragColor = vec4(0.0,0.0,0.0,alpha);
	}else{
		gl_FragColor = vec4(0.0,1.0,0.0,1.0);
	}
}

// gl_FragCoord
// probably need to do post processing antialiasing
