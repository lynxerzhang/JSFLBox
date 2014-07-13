var doc = fl.getDocumentDOM();

var library = null;
var items = null;
var bitmapType = "bitmap";

run();
function run()
{
	if(!checkDocument()){
		return;
	}
	library = doc.library;
	items = library.items;
	setImageQuality(items);
}

function checkDocument()
{
	var isLegal = true;
	if(!doc){
		alert("must open a .fla file.");
		isLegal = false;
	}
	return isLegal;
}

function setImageQuality(itemAry)
{	
	var len = itemAry.length;
	var subItem = null;
	var itemSuffix = null;
	for(var i = 0; i < len; i ++){
		subItem = itemAry[i];
		if(subItem.itemType == bitmapType){
			itemSuffix = getItemSuffix(subItem);
			subItem.allowSmoothing = true;
			//subItem.compressionType = "photo";
			if(itemSuffix == "png"){
				//消除锯齿效果更好, 但是最终会导致导出swf文件过大
				subItem.compressionType = "lossless"; 
			}
			else{
				subItem.compressionType = "photo";
			}
		}
	}
	doc.save();
}

function getItemSuffix(item)
{
	var s = item.name;
	if(s.lastIndexOf(".") > -1){
		s = s.slice(s.lastIndexOf(".") + 1);
	}
	return s;
}

function getItemName(item)
{
	var s = item.name;
	if(s.lastIndexOf("/") > -1){
		s = s.slice(s.lastIndexOf("/") + 1, s.length);
	}
	if(s.lastIndexOf(".") > -1){
		s = s.slice(0, s.lastIndexOf("."));
	}
	return s;
}
