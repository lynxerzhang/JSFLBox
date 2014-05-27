var doc = fl.getDocumentDOM();
var timeline = doc.getTimeline();

var layer = null;
var frame = null;
var element = null;

run();
function run()
{
	if(!checkDocument()){
		return;
	}
	if(!checkMovieClipState()){
		return;
	}
	setStageMatchContentSize(element);
}

function checkDocument()
{
	if(!doc){
		alert("no fla document is open!");
		return false;
	}
	var scenes = doc.timelines.length;
	//check the scene count
	if(scenes > 1){
		alert("only one scene is needed");
		return false;
	}
	//check the layer count
	var layercount = timeline.layerCount;
	if(layercount > 1){
		alert("only one layer is needed");
		return false;
	}
	return true;
}

function checkMovieClipState()
{
	var frameCount = timeline.frameCount;
	//check frame count
	if(frameCount != 1){
		alert("only one frame is needed!");
		return false;
	}
	layer = timeline.layers[0];
	frame = layer.frames[0];
	element = frame.elements[0];
	//check element is whether a movieclip's instance
	if(!element || element.elementType != "instance" || element.libraryItem.itemType != "movie clip"){
		alert("neeed a movieclip!");
		//same as element.libraryItem.symbolType
		//itemType in library maybe a folder or movieclip and something
		//symbolType maybe btn, graphic or movieclip
		return false;
	}
	if(element.symbolType != "movie clip"){
		fl.trace("instance " + (element.name != "" ? element.name : "NONAME") + " is not a movieclip, you may need check library in: " + element.libraryItem.name);
	}
	/*if(element instanceof SymbolInstance){
	}*/
	return true;
}

function setStageMatchContentSize(mc)
{
	var item = mc.libraryItem;
	var t = item.timeline;
	var totalframes = t.frameCount;
	var layercount = t.layers.length;
	var layer = null;
	
	var names = mc.name;
	mc.symbolType = "graphic";
	mc.loop = "single frame";
	
	var boundsAry = []; //does not check shape graphic's line
	var bounds;
	for(var k = 0; k < totalframes; k ++){
		mc.firstFrame = k;
		if(!(mc.width == 0 || mc.height == 0)){
			bounds = {};
			bounds.x = mc.left - mc.x;
			bounds.y = mc.top - mc.y;
			bounds.width = mc.width;
			bounds.height = mc.height;
			bounds.left = bounds.x;
			bounds.right = bounds.width + bounds.left;
			bounds.top = bounds.y;
			bounds.bottom = bounds.height + bounds.top;
			boundsAry.push(bounds);
		}
	}
	var boundsLen = boundsAry.length;
	var resultRect = null;
	if(boundsLen > 0){
		resultRect = boundsAry[0];
		for(var k = 1; k < boundsLen; k ++){
			resultRect = union(resultRect, boundsAry[k], resultRect);
		}
	}
	if(resultRect){
		round(resultRect);
		
		log(resultRect); //trace the result rectangle
		var rp = {x:-resultRect.x, y:-resultRect.y};
		mc.x = rp.x;
		mc.y = rp.y;
		doc.width = resultRect.width;
		doc.height = resultRect.height;
	}
	mc.symbolType = "movie clip";
	mc.name = names;
}

//below code are helper method
function log(data)
{
	var str = logComplexObj(data);
	fl.trace(str);
}

//used in log method
function logComplexObj(data)
{
	var k = [];
	for(var i in data){
		if(typeof(data[i]) == "object"){
			k.push(String("{" + i + ":" + logComplexObj(data[i]) + "}"));
		}
		else{
			k.push(String("{" + i + ":" + data[i] + "}"));
		}
	}
	return k.join("<->");
}

//get union rectangle
function union(lr, rr, result)
{
	var x = Math.min(lr.x, rr.x);
	var y = Math.min(lr.y, rr.y);
	var width = Math.max(lr.right, rr.right) - Math.min(lr.left, rr.left);
	var height = Math.max(lr.bottom, rr.bottom) - Math.min(lr.top, rr.top);
	
	result.x = x;
	result.y = y;
	result.width = width;
	result.height = height;
	
	result.left = result.x;
	result.right = result.width + result.left;
	result.top = result.y;
	result.bottom = result.height + result.top;
	return result;
}

//get round rectangle
function round(rect)
{
	var x = Math.floor(rect.left);
	var y = Math.floor(rect.top);
	var w = Math.ceil(rect.right) - x;
	var h = Math.ceil(rect.bottom) - y;
	
	rect.x = x;
	rect.y = y;
	rect.width = w;
	rect.height = h;
	rect.left = rect.x;
	rect.right = rect.width + rect.left;
	rect.top = rect.y;
	rect.bottom = rect.height + rect.top;
}

