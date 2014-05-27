var doc = fl.getDocumentDOM();

//symbol type constant
var movieclipType = "movie clip";
var folderType = "folder";
var bitmapType = "bitmap";
var soundType = "sound";

//prefix
var mcPrefix = "ui";
var bitmapPrefix = "bitmap";
var soundPrefix = "sound";
var library = null;
var items = null;
var prefixName = null;

run();
function run()
{
	if(!checkDocument()){
		return;
	}
	prefixName = prompt("please enter the prefix name.", "");
	if(!prefixName || prefixName == ""){
		return;
	}
	prefixName = prefixName.replace(/^\s+|\s+$/g, "");
	//get the library
	library = doc.library;
	items = library.items;
	generateEmbedClassByName(items);
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

function generateEmbedClassByName(itemAry)
{
	if(!itemAry){
		return;
	}
	var len = itemAry.length;
	var subItem = null;
	if(len > 0){
		for(var i = 0; i < len; i ++){
			subItem = itemAry[i];
			
			fl.trace(subItem.name);
			
			if(subItem.itemType == movieclipType){
				generateEmbedClassWithMovieClip(subItem, prefixName);
			}
			else if(subItem.itemType == soundType){
				generateEmbedClassWithSound(subItem, prefixName);
			}
			else if(subItem.itemType == bitmapType){
				//TODO
				generateEmbedClassWithBitmap(subItem, prefixName);
			}
			//else if(subItem.itemType == folderType){	
			//}
		}
		doc.selectAll();
		doc.deleteSelection();
		doc.save();
	}
}

//sprite will be same as movieclip
function generateEmbedClassWithMovieClip(item, prefix)
{
	var name = getLibraryItemRawName(item);
	if(!item.linkageExportForAS){
		item.linkageExportForAS = true;
		item.linkageExportInFirstFrame = true;
		item.linkageClassName = prefix + "_" + name;
	}
}
//raw bitmap
function generateEmbedClassWithBitmap(item, prefix)
{
	if(item.linkageExportForAS){
		item.linkageExportForAS = false;
		item.linkageExportInFirstFrame = false;
	}
	var name = getLibraryItemRawName(item);
	library.selectNone();
	//*
	if(library.itemExists(name)){
		//alert("already in the library");
		return;
	}
	//*/
	library.selectItem(item.name, false, true);
	//fl.trace([name, item.name]);
	library.addItemToDocument({"x":10, "y":10}, item.name);
	var bItem = doc.convertToSymbol(movieclipType, name, "top left");
	//fl.trace(bItem);//[object SymbolItem]
	if(bItem && !bItem.linkageExportForAS){
		bItem.linkageExportForAS = true;
		bItem.linkageExportInFirstFrame = true;
		bItem.linkageClassName = prefix + "_" + name;
	}
}

//sound 
function generateEmbedClassWithSound(item, prefix)
{
	var name = getLibraryItemRawName(item);
	if(!item.linkageExportForAS){
		item.linkageExportForAS = true;
		item.linkageExportInFirstFrame = true;
		item.linkageClassName = prefix + "_" + name;
	}
}

function getLibraryItemRawName(item)
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