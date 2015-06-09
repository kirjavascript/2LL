var state = 0;
var algs;
var matricies = [];
var visualcube = "http://www.speedsolving.com/wiki/extensions/algdb/vcube/visualcube.php?fmt=png&view=plan&alg=";
var mode = 0; // normal, ollcp, spam

onmessage = function(e) {
	if(state == 0) {
		state++;
		var data = JSON.parse(e.data)
		algs = data[1].split('\n');
		mirrorinvert();
		var max = algs.length;
		for(var i=0;i<algs.length;i++) {
			matricies[i] = matrix(algs[i]);
		}
		
		mode = data[2];
		if(mode==2) spam(data[0]);
		else solve(data[0]);
	}
}

function mirror(alg) {
	var norm="URFDLB";
	var mirror="ULFDRB";
	var out = '';
	while (alg.length > 0) {
		if (alg.match(/^[UDFBRL]/)) {
			var slice = alg.charAt(0);
			var loc = norm.indexOf(slice);
			slice = mirror[loc];
			alg = alg.slice(1);
			var pow = '';
			if (alg.match(/^['2]/)) {
				pow = alg.charAt(0) === "'" ? '\'' : '2';
				alg = alg.slice(1) 
			}
				if (pow == '') { pow = '\'';} else if (pow == '\'') {pow = '';}
				switch(loc) {
					case 12:if (pow == '') { pow = '\'';} else if (pow == '\'') {pow = '';}break;
					case 17:if (pow == '') { pow = '\'';} else if (pow == '\'') {pow = '';}break;
				}
			
			out+=slice+pow+' ';
		}
		else { alg = alg.slice(1) } 
	}
	return out.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function invert(alg) {
	var out = '';
	while (alg.length > 0) {
		if (alg.match(/^[UDFBRL]/)) {
			var slice = alg.charAt(0);
			alg = alg.slice(1);
			var pow = '\'';
			if (alg.match(/^['2]/)) {
				pow = alg.charAt(0) === "'" ? '' : '2';
				alg = alg.slice(1) 
			}
			out=slice+pow+' '+out;
		}
		else { alg = alg.slice(1) }
	}
	return out.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function mirrorinvert() {
	var max = algs.length;
	for(var i=0;i<max;i++) {
		algs[max+i] = mirror(algs[i]);
	}
	max = algs.length;
	for(var i=0;i<max;i++) {
		algs[max+i] = invert(algs[i]);
	}
}

function cycle(a,b,c) {
	if(c==0) {
		var buf = a[b[3]];
		for (var i = 3; i > 0; i--)	a[b[i]] = a[b[i-1]];
		a[b[0]] = buf;
	}
	else if(c==1) {
		var buf = a[b[0]];
		for (var i = 0; i < 3; i++)	a[b[i]] = a[b[i+1]];
		a[b[3]] = buf;
	}
	else if(c==2) {
		var buf = [a[b[0]],a[b[1]]];
		a[b[0]] = a[b[2]];
		a[b[1]] = a[b[3]];
		a[b[2]] = buf[0];
		a[b[3]] = buf[1];
	}
	return a;
}

function co(a,b,c) {
	if(c==0) for(var i=0;i<b.length;i++) a[b[i]]++,3==a[b[i]]&&(a[b[i]]=0);
	else if(c==1) for(var i=0;i<b.length;i++) 0==a[b[i]]?a[b[i]]=2:a[b[i]]--;
	return a;
}

function eo(a,b) {
	for(var i=0;i<b.length;i++) a[b[i]]=1-a[b[i]];
	return a;
}

function matrix(alg) {
	// UBL & UB
	// EP EP EP EP EO EO EO EO CP CP CP CP CO CO CO CO
	// (LB DB DBL)
	var a = [0,1,2,3,0,0,0,0,0,1,2,3,0,0,0,0,
	// 16,17,18,19, 20,21,22,23, 8,8,8,8, 8,8,8,8, 32,33,34,35, 8,8,8,8];
	4,5,6,7, 8,9,10,11, 0,0,0,0, 0,0,0,0, 4,5,6,7, 0,0,0,0];
	while (alg.length > 0) {
		if (alg.match(/^[UDFBRL]/)) {
			var slice = alg.charAt(0);
			alg = alg.slice(1);
			var pow = 0;
			if (alg.match(/^['2]/)) {
				pow = alg.charAt(0) === "'" ? 1 : 2;
				alg = alg.slice(1);
			}
			// 012 = _'2
			switch(slice) {
				case "D":
					a = cycle(a,[22,21,20,23],pow); // EP
					a = cycle(a,[35,34,33,32],pow); // CP
					a = cycle(a,[30,29,28,31],pow); // EO P
					a = cycle(a,[39,38,37,36],pow); // CO P
					break;
				case "B":
					a = cycle(a,[0,16,20,17],pow); // EP
					a = cycle(a,[9,8,32,33],pow); // CP
					a = cycle(a,[4,24,28,25],pow); // EO P
					a = cycle(a,[13,12,36,37],pow); // CO P
					if(pow != 2) {
						a = co(a,[13,36],1); // CO
						a = co(a,[12,37],0); // CO
						a = eo(a,[4,24,28,25]); // EO
					}
					break;
				case "L":
					a = cycle(a,[3,19,23,16],pow); // EP
					a = cycle(a,[8,11,35,32],pow); // CP
					a = cycle(a,[7,27,31,24],pow); // EO P
					a = cycle(a,[12,15,39,36],pow); // CO P
					if(pow != 2) {
						a = co(a,[12,39],1); // CO
						a = co(a,[15,36],0); // CO
					}
					break;
				case "U":
					a = cycle(a,[0,1,2,3],pow); // EP
					a = cycle(a,[8,9,10,11],pow); // CP
					a = cycle(a,[4,5,6,7],pow); //EO P
					a = cycle(a,[12,13,14,15],pow); // CO P
					break;
				case "R":
					a = cycle(a,[1,17,21,18],pow); // EP 
					a = cycle(a,[9,33,34,10],pow); // CP
					a = cycle(a,[5,25,29,26],pow); // EO P
					a = cycle(a,[13,37,38,14],pow); // CO P
					if(pow != 2) {
						a = co(a,[13,38],0); // CO
						a = co(a,[14,37],1); // CO
					}
					break;
				case "F":
					a = cycle(a,[2,18,22,19],pow); // EP
					a = cycle(a,[11,10,34,35],pow); // CP
					a = cycle(a,[6,26,30,27],pow); // EO P
					a = cycle(a,[15,14,38,39],pow); // CO P
					if(pow != 2) {
						a = co(a,[15,38],1); // CO
						a = co(a,[14,39],0); // CO
						a = eo(a,[6,26,30,27]); // EO
					}
					break;
			}
		}
		else { alg = alg.slice(1) }
	}
	for(var i=0;i<16;i++) if (a[i]>3) return 0; // LL check
	return a.slice(0,16);
}

function applymatrix(a,b) {
	var buf = [];
	// EP
	for(var i=0;i<4;i++) {
		buf[i] = a[b[i]];
		buf[i+4] = a[b[i]+4];
	}
	// EO
	for(i=4;i<8;i++) {
		if(b[i]!=0) {
			buf[i] = 1 - buf[i];
		}
	}
	// CP
	for(i=8;i<12;i++) {
		buf[i] = a[b[i]+8];
		buf[i+4] = a[b[i]+12];
	}
	// CO
	for(i=12;i<16;i++) {
		if(b[i]!=0) {
			buf[i] = (buf[i] + b[i]) % 3;
		}
	}
	return buf;
}

function solved(a,b) {
	var solved = [matrix(""),matrix("U"),matrix("U'"),matrix("U2")];
	if (b) for(var s=0;s<4;s++) solved[s] = applymatrix(b,solved[s]);
	var init = mode==1?4:0;
	for(var i=0;i<4;i++) {
		for(var j=init;j<17;j++) {
			if(j==16) return 1;
			else if (solved[i][j]!=a[j]) break;
		}
	}
	return 0;
}

function iso(a,b) {
	for(var i=0;i<4;i++) {
		buf = b;
		for(var j=0;j<4;j++) {
			buf[j]+=i;
			if(buf[j]>3)buf[j]-=4;
		}
		for(var j=8;j<12;j++) {
			buf[j]+=i;
			if(buf[j]>3)buf[j]-=4;
		}
		if(solved(a,buf)) return 1;
	}
	return 0;
}

function solve(input) {
	postMessage('clear');
	
	if(typeof input === "string") { 
		var position = matrix(input);
	}
	else {
		var position = input;
	}
	
	if(!position || solved(position)) {
		postMessage("Please enter an unsolved LL position");
		postMessage("done");
		state=0;
		return 0;
	}
	
	if(typeof input === "string") postMessage('<img src="'+visualcube+input+'">');
	
	var solution = 0;
	
	var pos_auf = [matrix(""),matrix("U"),matrix("U'"),matrix("U2")];
	var str_auf = ["","U","U'","U2"];
	
	for(var auf_1=0;auf_1<4;auf_1++) {
		var case_1 = applymatrix(position,pos_auf[auf_1]);
		
		for(var alg_1=0;alg_1<algs.length;alg_1++) {
			var case_2 = applymatrix(case_1,matricies[alg_1]);
			
			if(solved(case_2)) {
				postMessage('<br>' + str_auf[auf_1] + ' ' + algs[alg_1]);
				solution = 1;
				continue;
			}
			for(var auf_2=0;auf_2<4;auf_2++) {
				var case_3 = applymatrix(case_2,pos_auf[auf_2]);
				
				for(var alg_2=0;alg_2<algs.length;alg_2++) {
					var case_4 = applymatrix(case_3,matricies[alg_2]);
					if(solved(case_4)) {
						postMessage('<br>' + str_auf[auf_1] + ' ' + algs[alg_1] + ' ♦ ' + str_auf[auf_2] + ' ' + algs[alg_2]);
						solution = 1;
					}
				}
			}
		}
	}
	
	if(!solution) postMessage("<br>Error: No solutions found");
	
	postMessage("done");
	state=0;
}

function spam(a) {
	/*	    
     
    // Globals
    Vector<Alg> algs; // input
    Vector<Alg> best_solution; // output
     
    void search(Vector<Alg> chosen_algs) {
        if (!best_solution.empty() && chosen_algs.size() >= best_solution.size()) {
            return;
        }
     
        if (unsolved_cases() == 0) {
            best_solution = chosen_algs;
            return;
        }
     
        for (Alg alg : algs) {
            Vector<Case> cases = unsolved_cases_that_this_alg_solves(alg);
            if (cases.empty()) {
                continue;
            }
            for (Case case : cases) { case.mark_as_solved(); }
            chosen_algs.add(alg);
            search(chosen_algs);
            chosen_algs.remove(alg);
            for (Case case : cases) { case.mark_as_unsolved(); }
        }
    }
	*/
	postMessage('clear');
	a = a.slice(8,16);
	// ep = ;
	ep_p = [[3,1,2,0],[1,0,2,3],[0,3,2,1],[0,2,1,3],[0,1,3,2],[2,3,1,0],[1,3,0,2],[2,1,0,3],[3,2,0,1],[2,0,3,1],[3,0,1,2],[1,2,3,0]];
	eo_ = [[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,1,1],[1,0,1,0],[0,1,0,1],[1,1,1,1]];
	
	var solutions = [];
	var positions = [];
	
	var pos_auf = [matrix(""),matrix("U"),matrix("U'"),matrix("U2")];
	var str_auf = ["","U","U'","U2"];
	
	for(var i=0;i<eo_.length;i++) {
		for(var j=0;j<ep_p.length;j++) {
			position = ep_p[j].concat(eo_[i]).concat(a);
			
			//
			for(var k=0;k<positions.length;k++) {
				if(iso(position,positions[k])) {
					position = 0;
					break;
				}
			}
			if (position != 0 )
			// remove rotationally isomorphic positions
			
			positions.push(position);
		}
	} // generate positions
	
	postMessage(JSON.stringify(positions));
	
	for (var i=0;i<positions.length;i++) {
		solutions.push([0,positions[i]]);
		postMessage(JSON.stringify(positions[i]));
		/* solve */
			var solution = 0;
			
			for(var auf_1=0;auf_1<4;auf_1++) {
				var case_1 = applymatrix(positions[i],pos_auf[auf_1]);
				
				for(var alg_1=0;alg_1<algs.length;alg_1++) {
					var case_2 = applymatrix(case_1,matricies[alg_1]);
					
					if(solved(case_2)) {
						solutions[solutions.length-1].push([auf_1,alg_1]);
						solution = 1;
						continue;
					}
					for(var auf_2=0;auf_2<4;auf_2++) {
						var case_3 = applymatrix(case_2,pos_auf[auf_2]);
						
						for(var alg_2=0;alg_2<algs.length;alg_2++) {
							var case_4 = applymatrix(case_3,matricies[alg_2]);
							if(solved(case_4)) {
								solutions[solutions.length-1].push([auf_1,alg_1]);
								solution = 1;
							}
						}
					}
				}
			}
			
		if(!solution) postMessage("<br>ERROR");
		/* /solve */
	}
	
	var alg_cases = []; // save alg + cases
	while(unsolved_cases(solutions) > 0) {
		var best_alg = null;
		var best_count = 0;
		for(i=0;i<algs.length;i++) {
			var count = solves(solutions,i).length;
			if(count > best_count) {
				best_count = count;
				best_alg = i;
			}
		}
		
		alg_cases.push([algs[best_alg],solves(solutions,best_alg)]);
		
		solutions = marksolved(solutions,best_alg);
	}
	
	postMessage("<br>&nbsp;<br>"+JSON.stringify(alg_cases));
	
	for(i=0;i<alg_cases.length;i++) {
		for(var j=0;j<alg_cases[i][1].length;j++) {
			alg_cases[i][1][j] = applymatrix(alg_cases[i][1][j][1],matrix(alg_cases[i][1][j][0]));
		}
	}	// pre add AUF
	
	postMessage("<br>&nbsp;<br>"+JSON.stringify(alg_cases).replace(/'/g,'\\\''));
	state=0;
}

function solves(solutions,num) {
	var arr = [];
	var str_auf = ["","U","U'","U2"];
	for(var i=0;i<solutions.length;i++) {
		if(solutions[i][0]==0) {
			for(var j=2;j<solutions[i].length;j++) {
				if(solutions[i][j][1]==num) {
					arr.push([str_auf[solutions[i][j][0]],solutions[i][1]]);
					break;
				}
			}
		}
	}
	return arr;
}

function marksolved(solutions,num) {
	for(var i=0;i<solutions.length;i++) {
		if(solutions[i][0]==0) {
			for(var j=2;j<solutions[i].length;j++) {
				if(solutions[i][j][1]==num) {
					solutions[i][0] = 1;
					break;
				}
			}
		}
	}
	return solutions;
}

function unsolved_cases(solutions) {
	var a = 0;
	for(var i=0;i<solutions.length;i++) if(solutions[i][0]==0) a++;
	return a;
}