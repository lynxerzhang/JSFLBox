var doc = null;
var flaPath = null;
var outputPath = null;

var recursiveSearch = true;
var suffix = "fla";

run();
function run()
{
	var path = prompt("enter fla's file path", "");
	if(!path || path == ""){
		return;
	}
	flaPath = FLfile.platformPathToURI(path);
	if(!flaPath || flaPath == ""){
		return;
	}
	outputPath = flaPath + "/" + "output"; //create a new folder in root directory  
	var isContain = FLfile.exists(outputPath);
	if(!isContain){
		FLfile.createFolder(outputPath);
	}
	//recursiveSearch = false; //maybe you don't need recursive search 
	var folderlist = FLfile.listFolder(flaPath);
	exportFlaFile(folderlist, flaPath);
}

//
function exportFlaFile(folderlist, path)
{
	if(!folderlist){
		return;
	}
	//fl.trace(folderlist);
	var len = folderlist.length;
	var name = null;
	var isContain = null;
	var info = null;
	var flaPathName = null;
	for(var i = 0; i < len; i ++){
		name = folderlist[i];
		if(name){
			flaPathName = path + "/" + name;
			isContain = FLfile.exists(flaPathName);
			if(isContain){
				info = FLfile.getAttributes(flaPathName);
				if(info == "D"){
					//encounter a folder
					if(recursiveSearch){
						exportFlaFile(FLfile.listFolder(flaPathName), flaPathName);
					}
				}
				else{
					var isMatch = getType(flaPathName) == suffix;
					if(isMatch){
						fl.trace(flaPathName);
						fl.openDocument(flaPathName);
						if(fl.getDocumentDOM().asVersion != 3){
							fl.getDocumentDOM().asVersion = 3;
						}
						doc = fl.getDocumentDOM();
						//doc.exportSWF(flaPathName, true);
						doc.exportSWF(outputPath + "/" + getFileName(flaPathName), true);
						doc.save(false);
						doc.close();
						fl.trace(FLfile.uriToPlatformPath(flaPathName) + " complete export!");
					}
				}
			}
		}
	}
}

function getFileName(path)
{
	return path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
}

function getType(path)
{
	return path.slice(path.lastIndexOf(".") + 1);
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