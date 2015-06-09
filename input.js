var vcase = [];
var cubies = [['u1','b1'],['u5','r1'],['u7','f1'],['u3','l1'],['u0','l0','b0'],['u2','b2','r0'],['u8','r2','f2'],['u6','f0','l2']]; // UB UR UF UL UBL UBR UFR UFL
var cpos = [0,1,2,3,8,9,10,11];
var cubie = -1;

function makevinput(name) {
	var tbl = '';
	vcase = [0,1,2,3,0,0,0,0,0,1,2,3,0,0,0,0];
	var map = "Q;b0;b1;b2;;l0;u0;u1;u2;r0;l1;u3;u4;u5;r1;l2;u6;u7;u8;r2;;f0;f1;f2".split(";");
	//var map = "Q;b0;x;b2;;l0;u0;x;u2;r0;x;x;x;x;x;l2;u6;x;u8;r2;;f0;x;f2".split(";");
	for (var i=0;i<24;i++) {
		c = map[i][0];
		tbl += '<div onClick="clicksticker(this)" class="c" id="'+map[i]+'" style="background-color:#'+('b'==c?"0F0":'r'==c?"F00":'f'==c?"00D":'l'==c?"FA0":'u'==c?"EE0":'x'==c?"CCC":"FFF")+'"></div>';
	} 
	$(name).innerHTML = tbl;
}

function showcase(a) {
	for(var i=0;i<4;i++) {
		for(var j=i+1;vcase[i]!=a[i];j++) {
			cubie=i;
			swap(j)
		}
	}
	for(var i=4;i<8;i++) {
		if(a[i]==1) {
			cubie=i-4;
			twist();
		}
	}
	for(var i=8;i<12;i++) {
		for(var j=i+1;vcase[i]!=a[i];j++) {
			cubie=i-4;
			swap(j-4);
		}
	}
	for(var i=12;i<16;i++) {
		if(a[i]!=0) {
			cubie=i-8;
			a[i]==2&&twist();
			twist();
		}
	}
	cubie=-1;
}

function toggle(e) {
	if(e.value[0]=='V') {
		e.value = 'Algorithm Input';
		$('tbl').style.display = 'block';
		$('input').style.display = 'none';
	}
	else {
		e.value = 'Visual Input';
		$('tbl').style.display = 'none';
		$('input').style.display = '';
	}
}

function twist() {
	var buf = $(cubies[cubie][cubies[cubie].length-1]).style[b="backgroundColor"];
	for (var i = cubies[cubie].length-1; i > 0; i--) $(cubies[cubie][i]).style[b]= $(cubies[cubie][i-1]).style[b];
	$(cubies[cubie][0]).style[b] = buf;
	if(cubie<4) vcase[(cpos[cubie]+4)] = 1-vcase[(cpos[cubie]+4)];
	else vcase[(cpos[cubie]+4)] = (vcase[(cpos[cubie]+4)] + 1) % 3;
}

function swap(a) {
	var buf = [];	
	for(i=0;i<cubies[cubie].length;i++) buf[buf.length] = $(cubies[cubie][i]).style.backgroundColor;
	for(i=0;i<cubies[cubie].length;i++) $(cubies[cubie][i]).style.backgroundColor = $(cubies[a][i]).style.backgroundColor;
	for(i=0;i<cubies[cubie].length;i++) $(cubies[a][i]).style.backgroundColor = buf[i];
	buf = vcase[cpos[cubie]];
	vcase[cpos[cubie]] = vcase[cpos[a]];
	vcase[cpos[a]] = buf;
	buf = vcase[cpos[a]+4];
	vcase[cpos[a]+4] = vcase[cpos[cubie]+4];
	vcase[cpos[cubie]+4] = buf;
}

function togglecubie(a) {
	if($(cubies[a][0]).style.border=="")
		for (var i=0;i<cubies[a].length;i++) $(cubies[a][i]).style.border = '2px dashed #777';
	else 
		for (var i=0;i<cubies[a].length;i++) $(cubies[a][i]).style.border = '';
}

function clicksticker(a) {
	var buf = cubie;
	for (var i=0;i<8;i++) -1 < cubies[i].indexOf(a.id) && (cubie = i); // get cubie clicked
	if (buf == cubie) {
		twist();
		togglecubie(cubie);
		cubie = -1;
	}
	else if (buf!=-1&&cubies[cubie].length!=cubies[buf].length){
		togglecubie(buf);
		cubie = -1;
	}
	else if (buf!=-1&&cubies[cubie].length==cubies[buf].length){
		swap(buf);
		togglecubie(buf);
		cubie = -1;
	}
	else {
		togglecubie(cubie);
	}
}