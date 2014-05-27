var doc = fl.getDocumentDOM();

var library = null;
var items = null;
var itemLen = null;
var item = null;

run();
function run()
{
	if(!checkDocument()){
		return;
	}
	var findClassName = prompt("enter class name you want to search in library", "");
	if(!findClassName || findClassName == ""){
		return;
	}
	findClassName = findClassName.replace(/^\s+|\s+$/g, "");
	//findClassName = findClassName.toLowerCase();
	library = doc.library;
	items = library.items;
	itemLen = items.length;
	item = null;
	searchItemByClassName(findClassName);
}

function checkDocument()
{
	if(!doc){
		alert("must open a .fla file.");
		return false;
	}
	return true;
}

function searchItemByClassName(className, caseSensitive)
{
	var foundItem = null;
	var linkClassName = null;
	if(caseSensitive == void(0)){
		//void(0) just same as undefined
		caseSensitive = true;
	}
	for(var i = 0; i < itemLen; i ++){
		item = items[i];
		if(item){
			if(item.linkageExportInFirstFrame && item.linkageExportForAS){
				linkClassName = item.linkageClassName;
				if(!caseSensitive){
					linkClassName = linkClassName.toLowerCase();
				}
				if(linkClassName == className){
					foundItem = item;
					break;
				}
			}
		}
	}
	if(foundItem){
		fl.trace("instance is founded:>>" + item.name);
		var name = item.name;
		var index = name.lastIndexOf("/");
		if(index != -1){
			var folderName = name.slice(0, index);
			//fl.trace(folderName);
			//do not open or close folder in flashcs6, but not test in cs5 or cs5.5
			var expand = library.expandFolder(true, true, folderName);
			//fl.trace(expand);
		}
		library.selectItem(item.name, true, true);
		//add a instance to stage at stage point(10,10)
		library.addItemToDocument({"x":10, "y":10}, item.name);
	}
	else{
		fl.trace("not founded class name in library:>>" + className);
	}
}



