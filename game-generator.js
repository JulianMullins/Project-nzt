//start with random number generator and console out result: number between 0 and 8 (corresponds to position on 3x3 board)
//parseint will call a spot between 0 and 8 (refers to )
//console.log(parseInt(Math.random()*9))

//create array of up to 6 items, check for matches and stop and console if they atch, otherwise match last ones and console; clear array at the end
///POSITION ONLY
var out=[];
setInterval(function(){
	out.push(parseInt(Math.random()*9));
	//console.log(out[out.length-1])
	//pause for flash duration
	setTimeout(function(){
		console.log('flash',out[out.length-1])

	},500);
	//pause for thinking/processing time
	setTimeout(function(){
		console.log(out)
		if(out.length>1){
			if(out[out.length-1]===out[out.length-2]){
				console.log('match: ', out[out.length-1], out[out.length-2] );
				out=[];
				return
			}
			if(out.length===5){
				out.push(out[out.length-1])
				console.log('match: ', out[out.length-1], out[out.length-2]);
				out=[];
				return
			}
			else{
				console.log('no match')
			}
		};
	}, 2500)
},3000)