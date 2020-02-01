resPoint.style.display = 'none';
		function showLink(e){
	
			var id = getTableId(googleKey.value)
			if(id !== undefined && id != ""){
				if(!confirm("Внимание! Нажимая кнопку ОК, Вы подтверждаете: \n 1. Аудиофайлы размещаемые при помощи AudioMap принадлежат Вам или Вы обладаете правом на их публикацию в сети Интернет.  \n 2. Автор проекта AudioMap не несёт ответственности за сохранность и конфиденциальность аудиофайлов, презентируемых при помощи AudioMap.")) return;
				openMap.href = "map.html?googleSheetKey="+id;
				resPoint.style.display = 'block';
				resUrl.value = openMap.href;
			}else{
				resPoint.style.display = 'none';
				resUrl.value = "";
			}
		}
		createMap.onclick = showLink;
		googleKey.oninput = function(e){
			resPoint.style.display = 'none';
		}