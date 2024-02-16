let show_ants = false // Drawing is slower when true
let directed = false
let continuous = true
let bfs = false
let bidirectional = false
////////////
// You shouldn't need to modify anything
// below here (unless you want to)
/////////////


if(bfs) {
    show_ants = false
}

function euclidean_graph(coords, edges, scale, directed) {
    if(directed == null) {
        directed = false
    }
    let adj = []
    for(let xy of coords) {
        adj.push({"x":xy[0]*scale, "y":xy[1]*scale, "nbs":[]})
    }
    for(let [ui,vi] of edges) {
        let u = adj[ui], v = adj[vi]
        let wt = ((v.x - u.x)**2 + (v.y - u.y)**2)**.5
        u.nbs.push([v, wt])
        if(!directed) {
            v.nbs.push([u, wt])
        }
    }
    return adj
}

function rounded_euclidean_graph(coords, edges, unit, scale, directed) {
    if(directed == null) {
        directed = false
    }
    let adj = []
    for(let xy of coords) {
        adj.push({"x":xy[0]*scale, "y":xy[1]*scale, "nbs":[]})
    }
    for(let [ui,vi] of edges) {
        let u = adj[ui], v = adj[vi]
        let len = ((v.x - u.x)**2 + (v.y - u.y)**2)**.5
        let n = Math.ceil(len / unit)
        let verts = [u]
        for(let i = 1; i < n; ++i) {
            let t = 1.0*i/n;
            let newVert = {"x":(1-t)*u.x+t*v.x, "y":(1-t)*u.y + t*v.y, "nbs":[], "virtual":true}
            verts.push(newVert)
            adj.push(newVert)
        }
        verts.push(v)
        for(let i = 0; i < n; ++i) {
            let v0 = verts[i], v1 = verts[i+1]
            v0.nbs.push([v1,unit])
            if(!directed) {
                v1.nbs.push([v0,1])
            }
        }
    }
    return adj
}


let adj

let coords = [[0,0], [90,0], [10,40], [80,50], [150,20], [190,0], [0,75], [20,120], [80,100], [130,120], [190,110]]
let eds = [[0,1], [0,2], [1,3], [1,4], [3,2], [3,4], [3,8], [4,5], [9,4], [4,10], [6,8], [7,6], [8,9], [9,10], [8,7]]

if(bfs) {
    adj = rounded_euclidean_graph(coords, eds, 50, 2.5, directed)
} else {
    adj = euclidean_graph(coords, eds, 2.5, directed)
}



function bellman_ford(adj, s, t) {
    for(let u of adj) {
        u.d = Infinity
    }
    s.d = 0
    if(t != null) {
        t.d = 0
    }
    for(let i = 0; i < adj.length - 1; ++i) {
        for(let u of adj) {
            for(let [v, wt] of u.nbs) {
                if(v.d > u.d + wt) {
                    v.d = u.d + wt;
                    v.parent = u
                }
            }
        }
    }
}

function arrowhead(x0, y0, x1, y1, size, offset) {
    push()
    var angle = atan2(y1 - y0, x1 - x0);
    translate(x1, y1);
    rotate(angle + HALF_PI);
    translate(0, offset);
    triangle(-size*0.7, size, size*0.7, size, 0, -size/2);
    pop();
}


let max_d = 0
let bblue
let times

function setup()
{
    createCanvas(600, 400);
    colorMode(RGB, 1);
    background(.8);
    
    frameRate(10);

    if(bidirectional) {
        bellman_ford(adj, adj[0], adj[8])
    } else {
        bellman_ford(adj, adj[0])
    }

    for(let u of adj) {
        for(let [v,wt] of u.nbs) {
            max_d = max(max_d, u.d + 1 * wt);
        }
    }

    bblue = color(.4, .4, 1)

    // "times" is just a sorted, de-duplicated list of d values
    // There's certainly a cleaner way, but this works
    let timeObj = {}    
    for(let u of adj) {
        timeObj[u.d] = 1
    }
    times = Object.keys(timeObj)
    for(let i = 0; i < times.length; ++i) {
        times[i] = float(times[i])
    }
    sort(times)
}

function draw_boundary(adj, boundary, r, c) {
    for(let u of adj) {
        if(u.d <= boundary) {
            fill(c);
            noStroke();
            ellipse(u.x, u.y, r, r);
            for(let [v, wt] of u.nbs) {
                let ratio = min((boundary - u.d)/wt, 1);
                let x = lerp(u.x, v.x, ratio);
                let y = lerp(u.y, v.y, ratio);

                noStroke()
                ellipse(x, y, r, r)
                stroke(c);
                strokeWeight(r);
                line(u.x, u.y, x, y)
            }
        }
    }
}


let finished = false
let running = true

let boundary = 0;
let runFrames = 0

function draw()
{
    translate(50, 50);

    if(finished) {
        noLoop()
    }
    if(!running) {
        return
    }
    
    if(!continuous) {
        if(runFrames >= times.length) {
            finished = true
            noLoop()
            return
        }
        boundary = times[runFrames]
        runFrames = runFrames += 1
    } else {
        boundary += 4
    }
    
    draw_boundary(adj, boundary, 60, bblue)
    draw_boundary(adj, boundary, 30, color(1))
    
    if(show_ants) {
        for(let i = boundary; i > 0; i -= 20) {
            let t = .1 + .8 * i/max_d
            if(true || i-20 > 0) {
                draw_boundary(adj, i, 20, bblue) //color(0))
                draw_boundary(adj, i-12, 30, color(1))
            }
        }
    }
    
    for(let u of adj) {
        for(let [v, e] of u.nbs) {
            stroke(0);
            strokeWeight(6);
            line(u.x, u.y, v.x, v.y);
            fill(0);
            let x0 = u.x, y0 = u.y;
            let x1 = v.x, y1 = v.y;
            x1 = lerp(x0, x1, .5);
            y1 = lerp(y0, y1, .5);
            if(directed) {
                arrowhead(x0,y0, x1,y1, 5, 0)
            }
        }
    }

    for(let v of adj) {
        let c = color(0);
        let r = 10;
        if(v.d <= boundary) {
            c = bblue
            r = 25;
        }
        stroke(0)
        strokeWeight(1)
        fill(c);
        ellipse(v.x, v.y, r, r);
    }

    for(let i = 0; i < adj.length; ++i) {
        let u = adj[i]
        if(!u.virtual) {
            fill(1)
            stroke(0)
            strokeWeight(2)
            textSize(25)
            textAlign(CENTER, CENTER)
            text(i, u.x, u.y)
        }
    }
    
    if(boundary >= max_d) {
        finished = true
        noLoop()
    }

    if(!continuous) {
        running = false
    }
}

function keyPressed() {
    if(key == " ") {
        running = !running
    }
}